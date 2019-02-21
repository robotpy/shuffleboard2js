#!/usr/bin/env python
"""
    This is an example server application, using the tornado handlers,
    that you can use to connect your HTML/Javascript dashboard code to
    your robot via NetworkTables.
    Run this application with python, then you can open your browser to 
    http://localhost:8888/ to view the index.html page.
"""

import inspect
import os
from os.path import abspath, dirname, exists, join, basename
from optparse import OptionParser

import tornado.web
from tornado.web import StaticFileHandler
from tornado.ioloop import IOLoop

from networktables import NetworkTables
from pynetworktables2js import get_handlers

import shuffleboard2js

from datetime import date, datetime

try:
    import ujson as json
except ImportError:
    import json

import logging

logger = logging.getLogger("dashboard")

log_datefmt = "%H:%M:%S"
log_format = "%(asctime)s:%(msecs)03d %(levelname)-8s: %(name)-20s: %(message)s"

def pretty_json(d):
    return json.dumps(d, sort_keys=True, indent=4, separators=(',', ': '))


def init_networktables(options):
    NetworkTables.setNetworkIdentity(options.identity)

    if options.team:
        logger.info("Connecting to NetworkTables for team %s", options.team)
        NetworkTables.startClientTeam(options.team)
    else:
        logger.info("Connecting to networktables at %s", options.robot)
        NetworkTables.initialize(server=options.robot)

    if options.dashboard:
        logger.info("Enabling driver station override mode")
        NetworkTables.startDSClient()

    logger.info("Networktables Initialized")


class NonCachingStaticFileHandler(StaticFileHandler):
    """
        This static file handler disables caching, to allow for easy
        development of your Dashboard
    """

    # This is broken in tornado, disable it
    def check_etag_header(self):
        return False

    def set_extra_headers(self, path):
        # Disable caching
        self.set_header(
            "Cache-Control", "no-store, no-cache, must-revalidate, max-age=0"
        )

    def set_default_headers(self):
        '''Allow CORS requests from websim running on a different port in webpack'''
        
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Headers",
            "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By, If-Modified-Since, X-File-Name, Cache-Control")
        self.set_header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")


class ApiHandler(tornado.web.RequestHandler):

    def initialize(self, dashboard_path):

        self.dashboard_path = dashboard_path
        self.user_widgets_path = join(self.dashboard_path, 'widgets')
        

    def set_default_headers(self):
        '''Allow CORS requests from websim running on a different port in webpack'''
        
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Headers",
            "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By, If-Modified-Since, X-File-Name, Cache-Control")
        self.set_header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")

    def options(self, options):
        # no body
        self.set_status(204)
        self.finish()

    def get(self, param):
        '''
            GET handler
            
            Don't call this often, as it may block the tornado ioloop, which
            would be bad.. 
            
            :param param: The matching parameter for /api/(.*)
        '''
        
        if param == 'layout':
            layout = {}
            try: 
                with open(join(self.dashboard_path, 'layout.json'), 'r') as fp:
                    try:
                        layout = json.loads(fp.read())
                    except:
                        logger.error("Error reading config.json")
            except:
                pass

            self.write(layout)

        elif param == 'recordings':

            recordings_path = join(self.dashboard_path, 'recordings')

            recordings = {}

            for root, dirs, files in os.walk(recordings_path):
                if len(files) > 0:
                    recordings[basename(root)] = files

            self.write(recordings)

        elif param == 'widgets':
            widgets = []
            for root, dirs, files in os.walk(self.user_widgets_path):
                widgets.extend(dirs)

            self.write({
                'widgets': widgets
            })

        else:
            raise tornado.web.HTTPError(404)

    def post(self, param):

        '''
            POST handler
            
            Don't call this often, as it may block the tornado ioloop, which
            would be bad..
            
            :param param: The matching parameter for /api/(.*)
        '''
        
        if param == 'layout/save':
            
            data = json.loads(self.request.body.decode('utf-8'))
            
            with open(join(self.dashboard_path, 'layout.json'), 'w') as fp:
                fp.write(pretty_json(data))

        elif param == 'recording/save':

            recordings_path = join(self.dashboard_path, 'recordings')

            if not exists(recordings_path):
                os.mkdir(recordings_path)
            
            data = json.loads(self.request.body.decode('utf-8'))

            # create folder with date (YYYY-MM-DD)
            folder_name = str(date.today())       
            folder_path = join(recordings_path, folder_name)
            if not exists(folder_path):
                os.mkdir(folder_path)

            now = datetime.now()
            file_name = "recording-%s-%s-%s.json" % (now.hour, now.minute, now.microsecond)
            
            with open(join(folder_path, file_name), 'w') as fp:
                fp.write(pretty_json(data))
            
        else:
            raise tornado.web.HTTPError(404)

def main():
    '''Entrypoint called from wpilib.run'''


    # Setup options here
    parser = OptionParser()

    parser.add_option(
        "-p", "--port", type=int, default=8888, help="Port to run web server on"
    )

    parser.add_option(
        "-v",
        "--verbose",
        default=False,
        action="store_true",
        help="Enable verbose logging",
    )

    parser.add_option("--robot", default="127.0.0.1", help="Robot's IP address")

    parser.add_option("--team", type=int, help="Team number of robot to connect to")

    parser.add_option(
        "--dashboard",
        default=False,
        action="store_true",
        help="Use this instead of --robot to receive the IP from the driver station. WARNING: It will not work if you are not on the same host as the DS!",
    )

    parser.add_option(
        "--identity", default="pynetworktables2js", help="Identity to send to NT server"
    )

    options, args = parser.parse_args()

    # Setup logging
    logging.basicConfig(
        datefmt=log_datefmt,
        format=log_format,
        level=logging.DEBUG if options.verbose else logging.INFO,
    )

    if options.team and options.robot != "127.0.0.1":
        raise Exception("--robot and --team are mutually exclusive")

    # Setup NetworkTables
    init_networktables(options)

    # setup tornado application with static handler + networktables support
    html_dir = abspath(join(dirname(shuffleboard2js.__file__), "html", "dist"))
    index_html = join(html_dir, "index.html")
    vendor_dir = abspath(join(dirname(shuffleboard2js.__file__), "html", "vendor"))

    # Path where user files are served from
    robot_file = abspath(os.getcwd())
    dashboard_path = join(robot_file, 'dashboard')
    widget_path = join(dashboard_path, 'widgets')

    if not exists(dashboard_path):
        os.mkdir(dashboard_path)

    app = tornado.web.Application(
        get_handlers()
        + [
            (r'/widgets/(.*)', NonCachingStaticFileHandler, {'path': widget_path }),
            (r'/user/(.*)', NonCachingStaticFileHandler, {'path': dashboard_path }),
            (r'/api/(.*)', ApiHandler, {'dashboard_path': dashboard_path}),
            (r"/()", NonCachingStaticFileHandler, {"path": index_html}),
            (r"/vendor/(.*)", NonCachingStaticFileHandler, {"path": vendor_dir}),
            (r"/(.*)", NonCachingStaticFileHandler, {"path": html_dir}),
        ]
    )

    # Start the app
    logger.info("Listening on http://localhost:%s/", options.port)

    app.listen(options.port)
    IOLoop.current().start()



if __name__ == "__main__":
    main()
#!/usr/bin/env python
"""
    This is an example server application, using the tornado handlers,
    that you can use to connect your HTML/Javascript dashboard code to
    your robot via NetworkTables.
    Run this application with python, then you can open your browser to 
    http://localhost:8888/ to view the index.html page.
"""

import inspect
import sys
import os
from os.path import abspath, dirname, exists, join, basename
from optparse import OptionParser
import webbrowser
import threading
import time
import configparser

import tornado.web
from tornado.web import StaticFileHandler
from tornado.ioloop import IOLoop

from networktables import NetworkTables
from pynetworktables2js import get_handlers

import shuffleboard2js

from tkinter import filedialog
import tkinter

from datetime import date, datetime

try:
    import ujson as json
except ImportError:
    import json

import logging

logger = logging.getLogger("dashboard")

log_datefmt = "%H:%M:%S"
log_format = "%(asctime)s:%(msecs)03d %(levelname)-8s: %(name)-20s: %(message)s"


def get_application_path():
    if getattr(sys, 'frozen', False):
        # If the application is run as a bundle, the pyInstaller bootloader
        # extends the sys module by a flag frozen=True and sets the app 
        # path into variable _MEIPASS'.
        return sys._MEIPASS
    else:
        return os.path.dirname(os.path.abspath(__file__))

def get_config_parser():

    config = configparser.SafeConfigParser()

    config.read_dict({
        'DEFAULT': {
            'default_layout_location': '',
            'default_widget_folder': '',
            'robot_ip': 'localhost'
        }
    })

    dashboard_path = os.path.expanduser('~/shuffleboard2js')
    properties_path = join(dashboard_path, 'properties.ini')

    if not exists(dashboard_path):
        os.mkdir(dashboard_path)

    if not exists(properties_path):
        f = open(properties_path, 'a+')
        f.close()

    config.read(properties_path)

    return config


def get_config(key):
    config = get_config_parser()
    return config.get('DEFAULT', key)

def set_config(key, value):
    dashboard_path = os.path.expanduser('~/shuffleboard2js')
    properties_path = join(dashboard_path, 'properties.ini')

    if not exists(dashboard_path):
        os.mkdir(dashboard_path)

    config = get_config_parser()
    config.set('DEFAULT', key, value)
    with open(properties_path, "w+") as configfile:
        config.write(configfile) 

def select_widget_folder_dialog():
    root = tkinter.Tk()
    root.overrideredirect(1)
    root.directory = filedialog.askdirectory()
    root.update()
    return root.directory

def open_layout_dialog():
    root = tkinter.Tk()
    root.overrideredirect(1)
    layout_location = os.path.dirname(get_config('default_layout_location'))

    if layout_location:
        root.filename = filedialog.askopenfilename(initialdir=layout_location, title = "Open layout", filetypes=[("JSON files", "*.json")])
    else:
        root.filename = filedialog.askopenfilename(title = "Open layout", filetypes=[("JSON files", "*.json")])
    
    root.update()
    return root.filename

def save_layout_dialog():
    root = tkinter.Tk()
    root.overrideredirect(1)
    layout_location = os.path.dirname(get_config('default_layout_location'))
    layout_filename = os.path.basename(get_config('default_layout_location'))

    if layout_location:
        root.filename = filedialog.asksaveasfilename(initialdir=layout_location, initialfile=layout_filename, title = "Save layout", filetypes=[("JSON files", "*.json")])
    else:
        root.filename = filedialog.asksaveasfilename(title = "Save layout", filetypes=[("JSON files", "*.json")])
    
    root.update()
    return root.filename

def pretty_json(d):
    return json.dumps(d, sort_keys=True, indent=4, separators=(',', ': '))

def set_robot_ip(ip):
    NetworkTables.shutdown()
    NetworkTables.initialize(server=ip)

def init_networktables(options):
    NetworkTables.setNetworkIdentity(options.identity)

    logger.info("Connecting to networktables at %s", options.robot)
    NetworkTables.initialize(server=options.robot)

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

class WidgetFileHandler(NonCachingStaticFileHandler):
    """
        This static file handler disables caching, to allow for easy
        development of your Dashboard
    """
    
    @classmethod
    def get_absolute_path(cls, root, path):
        return StaticFileHandler.get_absolute_path(get_config('default_widget_folder'), path)
    
    
class ApiHandler(tornado.web.RequestHandler):

    def initialize(self, dashboard_path):

        self.dashboard_path = dashboard_path
        

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
        
        if param == 'recordings':

            dashboard_path = os.path.expanduser('~/shuffleboard2js')
            recordings_path = join(dashboard_path, 'recordings')

            if not exists(dashboard_path):
                os.mkdir(dashboard_path)

            if not exists(recordings_path):
                os.mkdir(recordings_path)

            recordings = {}

            for root, dirs, files in os.walk(recordings_path):
                if len(files) > 0:
                    recordings[basename(root)] = files

            self.write(recordings)

        elif param == 'widgets':
            widgets = []
            for root, dirs, files in os.walk(get_config('default_widget_folder')):
                widgets.extend(dirs)

            self.write({
                'widgets': widgets
            })

        elif param == 'open_layout':
            filename = open_layout_dialog()
            
            layout = {}
            try: 
                with open(filename, 'r') as fp:
                    try:
                        layout = json.loads(fp.read())
                        set_config('default_layout_location', filename)
                    except:
                        logger.error("Error reading layout")
            except:
                pass

            self.write(layout)

        elif param == 'open_default_layout':
            filename = get_config('default_layout_location')
            layout = {}
            try: 
                with open(filename, 'r') as fp:
                    try:
                        layout = json.loads(fp.read())
                    except:
                        logger.error("Error reading layout")
            except:
                pass

            self.write(layout)

        elif param == 'select_widget_folder':
            widget_folder = select_widget_folder_dialog()
            widgets = []
            for root, dirs, files in os.walk(widget_folder):
                widgets.extend(dirs)

            set_config('default_widget_folder', widget_folder)

            self.write({
                'widget_folder': widget_folder
            })

        elif param == 'get_robot_ip':
            self.write({
                'robot_ip': get_config('robot_ip')
            })

        elif param == 'get_widget_folder':
            self.write({
                'widget_folder': get_config('default_widget_folder')
            })

        elif param == 'set_robot_ip':
            robot_ip = self.get_argument("robot_ip", 'localhost')
            set_robot_ip(robot_ip)
            set_config('robot_ip', robot_ip)

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

            filename = save_layout_dialog()

            if filename:         
                set_config('default_layout_location', filename)
                with open(filename, 'w') as fp:
                    fp.write(pretty_json(data))

        elif param == 'recording/save':

            dashboard_path = os.path.expanduser('~/shuffleboard2js')
            recordings_path = join(dashboard_path, 'recordings')

            if not exists(dashboard_path):
                os.mkdir(dashboard_path)

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

    parser.add_option("--robot", default=get_config('robot_ip'), help="Robot's IP address")

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

    # Setup NetworkTables
    init_networktables(options)

    application_path = get_application_path()

    # setup tornado application with static handler + networktables support
    html_dir = abspath(join(application_path, "html", "dist"))
    index_html = join(html_dir, "index.html")
    vendor_dir = abspath(join(application_path, "html", "vendor"))

    # Path where user files are served from
    dashboard_path = os.path.expanduser('~/shuffleboard2js')

    if not exists(dashboard_path):
        os.mkdir(dashboard_path)

    app = tornado.web.Application(
        get_handlers()
        + [
            (r'/widgets/(.*)', WidgetFileHandler, {'path': '/'}),
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


    def launch_browser():
		
        try:
            time.sleep(1.0)
            w = None
            
            # Prefer chrome if available
            for b in ['chrome', 'google-chrome', 'chromium', 'chromium-browser', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe %s']:
                if w is not None:
                    break
                try:
                    w = webbrowser.get(using=b)
                    
                except:
                    pass
            
            if w is None:
                w = webbrowser.get()
            
            w.open('http://localhost:%s/' % options.port)
        except:
            logger.exception("Unexpected error trying to open browser automatically")
        
        return False


    launch_thread = threading.Thread(target=launch_browser, daemon=True)
    launch_thread.start()

    IOLoop.current().start()



if __name__ == "__main__":
    main()
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
from os.path import abspath, dirname, exists, join
from optparse import OptionParser

import tornado.web
from tornado.ioloop import IOLoop

from networktables import NetworkTables
from pynetworktables2js import get_handlers, NonCachingStaticFileHandler

import logging

logger = logging.getLogger("dashboard")

log_datefmt = "%H:%M:%S"
log_format = "%(asctime)s:%(msecs)03d %(levelname)-8s: %(name)-20s: %(message)s"


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

class Main:
    '''Entrypoint called from wpilib.run'''


    def __init__(self, parser):
        pass

    def run(self, options, robot_class, **kwargs):

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
            parser.error("--robot and --team are mutually exclusive")

        # Setup NetworkTables
        init_networktables(options)

        # setup tornado application with static handler + networktables support
        html_dir = abspath(join(dirname(__file__), "html", "dist"))
        index_html = join(html_dir, "index.html")

        # Path where user files are served from
        robot_file = abspath(inspect.getfile(robot_class))
        robot_path = dirname(robot_file)

        dashboard_path = join(robot_path, 'dashboard')
        if not exists(dashboard_path):
            os.mkdir(dashboard_path)

        app = tornado.web.Application(
            get_handlers()
            + [
                #(r'/user/(.*)', NonCachingStaticFileHandler, {'path': dashboard_path }),
                (r"/()", NonCachingStaticFileHandler, {"path": index_html}),
                (r"/(.*)", NonCachingStaticFileHandler, {"path": html_dir}),
            ]
        )

        # Start the app
        logger.info("Listening on http://localhost:%s/", options.port)

        app.listen(options.port)
        IOLoop.current().start()


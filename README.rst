shuffleboard2js
===============

shuffleboard2js further lowers the barrier of entry for teams that want to build a custom HTML/Javascript dashboard by providing a `Shuffleboard <https://wpilib.screenstepslive.com/s/currentCS/m/shuffleboard/l/814689-tour-of-shuffleboard>`_ like interface built on top of `pynetworktables2js <https://github.com/robotpy/pynetworktables2js>`_.

Lots of students and mentors know how to create simple web pages to display content, and there's lots of resources out there for creating dynamic content for webpages that use javascript. There is a lot of visually appealing content that others have created using web technologies -- why not leverage those resources to make something cool to control your robot?


Documentation
-------------

Documentation can be found at http://shuffleboard2js.readthedocs.org/


Installation
------------

Make sure to install python 3 on your computer, and on Windows you can
execute::

    py -3 -m pip install shuffleboard2js
    
On Linux/OSX you can execute::

    pip install shuffleboard2js


Usage
-----

You can run shuffleboard2js using the following command::

    python3 -m shuffleboard2js

Or on Windows::

    py -3 -m shuffleboard2js

This will start a server which will serve from the current directory. You can create your custom widgets in the **shuffleboard2js/widgets** folder, which will automatically be created in the directory you ran shuffleboard2js.

You will want to also pass either the ``--robot`` or ``--team`` switch::

    py -3 -m shuffleboard2js --robot roborio-XXXX-frc.local
    py -3 -m shuffleboard2js --team XXXX

Dashboard mode currently doesn't work, as the underlying support in
pynetworktables hasn't been implemented yet for the newer FRC Driver Station.

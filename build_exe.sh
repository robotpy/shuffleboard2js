#!/bin/bash
#
# Builds a pyinstaller-based Windows exe for shuffleboard2js
#

cd $(dirname $0)
docker run --rm -v "$(pwd):/src:Z" -e PYTHONPATH=/src cdrx/pyinstaller-windows:python3
docker run --rm -v "$(pwd):/src:Z" --entrypoint /bin/bash cdrx/pyinstaller-windows:python3 -c "chown -R $(id -u $USERNAME) /src/dist"

mv dist/windows/shuffleboard2js.exe dist
cd dist
zip shuffleboard2js-$(git describe --tags).zip shuffleboard2js.exe
cd ..
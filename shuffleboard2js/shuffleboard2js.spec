# -*- mode: python -*-

block_cipher = None


a = Analysis(['__main__.py'],
             pathex=['/Users/amorygalili/Projects/robotics/shuffleboard2js/shuffleboard2js'],
             binaries=[],
             datas=[('html/dist', 'html/dist'), ('html/vendor', 'html/vendor'), ('html/pynetworktables2js/pynetworktables2js', 'pynetworktables2js')],
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          [],
          name='shuffleboard2js',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          runtime_tmpdir=None,
          console=True )

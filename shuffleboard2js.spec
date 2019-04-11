# -*- mode: python -*-

block_cipher = None


a = Analysis(['shuffleboard2js/__main__.py'],
             binaries=[],
             datas=[('shuffleboard2js/html/dist', 'html/dist'), ('shuffleboard2js/html/vendor', 'html/vendor'), ('shuffleboard2js/html/pynetworktables2js/pynetworktables2js', 'pynetworktables2js')],
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

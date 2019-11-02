const cargoImage = require('./cargo_ship_transparent.png');

<lift_heights>
    <div id="svg-container" style="width:100%;height:100%;">
    <svg width='100%' height='100%' viewBox="0 0 100 100">
        <image xlink:href="{cargoImage}" x="52%" y="0" height="100%" width="50%"/>

        <!-- Rocket ball button SVG elements -->
        <ellipse onclick={topLeft} cx = '67.3%' cy = '38%' rx = '4%' ry = '5%' style="fill:lime;fill-opacity:0;stroke:black;stroke-width:.8"/>
        <ellipse cx = '67.3%' cy = '55%' rx = '4%' ry = '5%' style="fill:lime;fill-opacity:0;stroke:black;stroke-width:.8"/>
        <ellipse cx = '67.3%' cy = '72%' rx = '4%' ry = '5%' style="fill:lime;fill-opacity:0;stroke:black;stroke-width:.8"/>

        <!-- Rocket hatch button SVG elements -->
        <ellipse cx = '78%' cy = '43.5%' rx = '4.15%' ry = '5%' style="fill:lime;fill-opacity:0;stroke:black;stroke-width:.8"/>
        <ellipse cx = '78%' cy = '60.5%' rx = '4.15%' ry = '5%' style="fill:lime;fill-opacity:0;stroke:black;stroke-width:.8"/>
        <ellipse cx = '78%' cy = '77.5%' rx = '4.15%' ry = '5%' style="fill:lime;fill-opacity:0;stroke:black;stroke-width:.8"/>
        
        <image xlink:href="{cargoImage}" x="1" y="20%" height="100%" width="50%"/>

        <!-- Cargo ship ball SVG elements-->
        <polygon points="1.5,63.7 8.3,52.8 22.5,60.5 15.5,72" style="fill:lime;fill-opacity:0;stroke:black;stroke-width:.8" />
        <polygon points="27.5,62.5 30,77 49.8,68.8 36.5,58.5" style="fill:lime;fill-opacity:0;stroke:black;stroke-width:.8" />
        
        <!-- Cargo ship hatch SVG elements-->
        <polygon points="1.4,64.5 15.5,72.5 16,84.3 1.4,76" style="fill:lime;fill-opacity:.7;stroke:black;stroke-width:.8" />
        <polygon points="30,77 49.8,68.8 50.5,81 30.5,90" style="fill:lime;fill-opacity:.7;stroke:black;stroke-width:.8" />
        </svg>
    </div>


    <script>

        this.topLeft = (ev) => {
            let target = ev.target;
            $(target).css('fill-opacity', .7);
            console.log('ev:', ev);
        }     

    </script>
</lift_heights>

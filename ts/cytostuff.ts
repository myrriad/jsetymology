// a lot of the toolbar stuff is in cytoscape-panzoom.js



namespace CytoUtils {

    export function addOverlay(centralHTMLContent: string) {
        let $panzoom = $('.cy-panzoom');
        let $overlay = $('<div class="cy-overlay"></div>');
        $panzoom.append($overlay);
        $overlay.draggable({
            containment: $panzoom
        });
        $overlay.append("Hi!");

        $overlay.append("<button class='cy-overlay-button'>Button</button>");

        $overlay.append("<span class='cy-overlay-close' onclick='this.parentNode.parentNode.removeChild(this.parentNode); return false;'>X</span>");
        // $overlay.resizable({
        //     containment: $panzoom
        // });

    }

    // function $tElement(html: str) {
    //     var $out = $(html);
    //     $toolbar.append($out);
    //     return $out;
    // }

    // function $tMode(toolbarmode, html: str) {
    //     var $out = $(html);
    //     // http://jsfiddle.net/zAFND/2/
    //     $out.toolbarMode = toolbarmode;
    //     $toolbar.append($out);
    //     return $out;
    // }
}
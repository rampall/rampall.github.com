/*******************************************************************************
  @author davean  <davean@xkcd.com>
  
  Copyright (c) 2011 xkcd inc
*******************************************************************************/

function decode_url(s) {
    return decodeURIComponent(s.replace(/\+/g, " "));
};

function parseHash() {
   var params = {}, e, rgxVar = /([^&=]+)=?([^&]*)/g, pstr = window.location.hash.substring(1);
   while (e = rgxVar.exec(pstr))
       params[decode_url(e[1])] = decode_url(e[2]);

    return params;
};

function HashControl(viewer) {
  this.viewer = viewer;
}

HashControl.prototype.init = function() {

}

HashControl.prototype.setListeners = function() {
  this.viewer.addViewerMovedListener(this);
  this.viewer.addViewerZoomedListener(this);
  this.viewer.addViewerResizedListener(this);
}

HashControl.prototype.restorePossition = function() {
  var params = parseHash();
  if (params['x'] && params['y'] && params['z']) {
      this.viewer.zoom(parseInt(params['z']) - this.viewer.zoomLevel);

      var c = { 'x': parseInt(params['x'])
              , 'y' : parseInt(params['y']) };
      c = this.viewer.toViewerFromImage(c);
      c = { 'x': Math.floor(c['x'] + (this.viewer.width / 2))
          , 'y': Math.floor(c['y'] + (this.viewer.height / 2)) };
      this.viewer.x = c['x'];
      this.viewer.y = c['y'];
      this.viewer.positionTiles();
   }

}

HashControl.prototype.updateHash = function() {
    var c = { 'x': Math.ceil(this.viewer.x - (this.viewer.width / 2))
            , 'y': Math.ceil(this.viewer.y - (this.viewer.height / 2))};
    c = this.viewer.toImageFromViewer(c);

    var posStr = 'x='+c['x']+'&y='+c['y']+'&z='+this.viewer.zoomLevel;
    window.location.hash = posStr;
    //$.get('/980/interest.dat?'+posStr+'&w='+this.viewer.width+'&h='+this.viewer.height);
}

HashControl.prototype.viewerMoved = function(e) {
    this.updateHash();
}

HashControl.prototype.viewerZoomed = function(e) {
    this.updateHash();
}

HashControl.prototype.viewerResized = function(e) {
    this.updateHash();
}

//leaflet OSM map
let polyline;
let mymap;
let latlngs;
let centerpin;
let markers_group = [];

function init() {    
    // マップ表示
    mymap = L.map('mapid');
    mymap.setView([35.69236889135515, 139.83192111797422], 11);    
    
    // OSMコピーライト表記
    var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ', {
	  attribution : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	  maxZoom: 18,
	  });
    tileLayer.addTo(mymap);

    // 南風運用・RWY16R(ILS/LOC)の描画（デフォルト）
    drawILSRWY16R();
    
    // 展望スポットのプロット
    L.marker([35.658587176092915, 139.7454333839678]).bindPopup('東京タワー').addTo(mymap);
    L.marker([35.7100627, 139.8100104]).bindPopup('東京スカイツリー').addTo(mymap);
    L.marker([35.6896839, 139.6917732]).bindPopup('東京都庁').addTo(mymap);
    L.marker([35.72943627338799, 139.71811152111064]).bindPopup('サンシャイン60展望台').addTo(mymap);
    L.marker([35.66036646901532, 139.72910786935068]).bindPopup('六本木ヒルズ東京シティービュー').addTo(mymap);
    L.marker([35.7079855544783, 139.75210154638836]).bindPopup('文京シビック').addTo(mymap);
    L.marker([35.6438171, 139.6691396]).bindPopup('キャロットタワー').addTo(mymap);
    L.marker([35.6173679, 139.7800048]).bindPopup('テレコムセンター展望室').addTo(mymap);
    L.marker([35.62694688896252, 139.77466288282122]).bindPopup('フジテレビ 球体展望室「はちたま」').addTo(mymap);
    L.marker([35.642058803268895, 139.71336892126396]).bindPopup('恵比寿ガーデンプレイス　TOP OF YEBISU').addTo(mymap);
    L.marker([35.63645181937626, 139.76348475617007]).bindPopup('レインボーブリッジ　歩道').addTo(mymap);
}

// Instrument Approach Chart (ILS or LOC RWY16R)
function drawILSRWY16R(){
    // 描画済み線を削除
    removeObjects();
    let waypoints = [
        [35.897472, 139.758694], //NATTY
        [35.8754, 139.7027], //RANGY
        [35.84083,139.615833], //RESIN
        [35.77416,139.6161], //RUGBY
        [35.55834352304508 ,139.7702078865645] //16R
    ]
    polyline = L.polyline(waypoints, {color: 'red'}).addTo(mymap);

    // 高度のプロット
    let marker_rangy = L.marker([35.8754, 139.7027], {icon: L.divIcon({className: 'red_marker'})}).bindPopup('900m(3000ft)').addTo(mymap); // RANGY
    markers_group.push(marker_rangy);
    let marker_rugby = L.marker([35.77416,139.6161], {icon: L.divIcon({className: 'red_marker'})}).bindPopup('900m(3000ft)').addTo(mymap); // RUGBY
    markers_group.push(marker_rugby);
}

// Instrument Approach Chart (RNAV RWY16R)
function drawRNAVRWY16R(){
    // 描画済み線を削除
    removeObjects();
    let waypoints = [
        [35.9264127, 139.7587], // NATTY
        [35.864838, 139.676225], //RACER
        [35.80208, 139.63208], // REMUS
        [35.7519138, 139.6323194], // ROWAN
        [35.70354, 139.66685], // RIPOD
        [35.6544083, 139.7018861], // T6R73
        [35.6038, 139.73785], // T6R74
        [35.55834352304508 ,139.7702078865645] //16R
    ]
    polyline = L.polyline(waypoints, {color: 'red'}).addTo(mymap);

    // 高度のプロット
    let marker_ripod = L.marker([35.70354, 139.66685], {icon: L.divIcon({className: 'red_marker'})}).bindPopup('1200m(3800ft)').addTo(mymap); // RIPOD
    markers_group.push(marker_ripod);
    let marker_t6r73 = L.marker([35.6544083, 139.7018861], {icon: L.divIcon({className: 'red_marker'})}).bindPopup('800m(2561ft)').addTo(mymap); // T6R73
    markers_group.push(marker_t6r73);
    let marker_t6r74 = L.marker([35.6038, 139.73785], {icon: L.divIcon({className: 'red_marker'})}).bindPopup('400m(1279ft)').addTo(mymap); // T6R74
    markers_group.push(marker_t6r74);

}

// Instrument Approach Chart (ILS or LOC RWY16L)
function drawILSRWY16L(){
    // 描画済み線を削除
    removeObjects();
    let waypoints = [
        [35.821527, 139.7341], // SANDY
        [35.821416, 139.68494], //LABAN
        [35.82127, 139.635], // LINEN
        [35.778472, 139.635194], // LORRY
        [35.56569252989162, 139.78671195194357] //16L
    ]
    polyline = L.polyline(waypoints, {color: 'blue'}).addTo(mymap);

    // 高度のプロット
    let marker_laban = L.marker([35.821416, 139.68494], {icon: L.divIcon({className: 'blue_marker'})}).bindPopup('1200m(4000ft)').addTo(mymap); // LABAN
    markers_group.push(marker_laban);
    let marker_limen = L.marker([35.82127, 139.635], {icon: L.divIcon({className: 'blue_marker'})}).bindPopup('1200m(4000ft)').addTo(mymap); // LINEN
    markers_group.push(marker_limen);
}

// Instrument Approach Chart (RNAV RWY16L)
function drawRNAVRWY16L(){
    // 描画済み線を削除
    removeObjects();
    let waypoints = [
        [35.821527, 139.7341], // SANDY
        [35.74836, 139.68261], // LYCEE
        [35.6957805, 139.6941805], // LAUDA
        [35.6494972, 139.7271361], // T6L61
        [35.6032916, 139.75998], // T6L62
        [35.577294, 139.7784527], // T6L63
        [35.56569252989162, 139.78671195194357] //16L
    ]
    polyline = L.polyline(waypoints, {color: 'blue'}).addTo(mymap);

    // 高度のプロット
    let marker_sandy = L.marker([35.821527, 139.7341], {icon: L.divIcon({className: 'blue_marker'})}).bindPopup('1400m(4500ft)').addTo(mymap); // LABAN
    markers_group.push(marker_sandy);
    let marker_lauda = L.marker([35.6957805, 139.6941805], {icon: L.divIcon({className: 'blue_marker'})}).bindPopup('1000m(3446ft)').addTo(mymap); // LAUDA
    markers_group.push(marker_lauda);
    let marker_t6l61 = L.marker([35.6494972, 139.7271361], {icon: L.divIcon({className: 'blue_marker'})}).bindPopup('700m(2271ft)').addTo(mymap); // T6L61
    markers_group.push(marker_t6l61);
    let marker_t6l62 = L.marker([35.6032916, 139.75998], {icon: L.divIcon({className: 'blue_marker'})}).bindPopup('330m(1099ft)').addTo(mymap); // T6L62
    markers_group.push(marker_t6l62);


}

function removeObjects(){
    // 初回描画時など，polylineが宣言されているが地図上に何も描画されていないときは，removeを行うとエラーになる．
    // ここで判定を行い，描画が存在するときのみ，その描画を削除する．
    if(polyline!=null){
        polyline.remove();
    }

    // marker削除
    markers_group.forEach( function(value) {
        value.remove();
    });
}
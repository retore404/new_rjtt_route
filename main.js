//leaflet OSM map
let polyline;
let mymap;
let latlngs;
let centerpin;
function init() {    
    // マップ表示
    mymap = L.map('mapid');
    mymap.setView([35.6195479,139.7640561], 15);    
    
    // OSMコピーライト表記
    var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ', {
	  attribution : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	  maxZoom: 18,
	  });
    tileLayer.addTo(mymap);

    // 南風運用・RWY16R(ILS/LOC)の描画（デフォルト）
    drawILSRWY16R();

    //マップクリック時にその地点の緯度経度をconsole出力
    mymap.on('click', function(e) {      
        let clicked_position= e.latlng;
        console.log(clicked_position['lat'], clicked_position['lng']);      
      });
}

// Instrument Approach Chart (ILS or LOC RWY16R)
function drawILSRWY16R(){
    // 描画済み線を削除
    removePolyline();
    let waypoints = [
        [35.897472, 139.758694], //NATTY
        [35.8754, 139.7027], //RANGY
        [35.84083,139.615833], //RESIN
        [35.77416,139.6161], //RUGBY
        [35.55834352304508 ,139.7702078865645] //16R
    ]
    polyline = L.polyline(waypoints, {color: 'red'}).addTo(mymap);
}

// Instrument Approach Chart (RNAV RWY16R)
function drawRNAVRWY16R(){
    // 描画済み線を削除
    removePolyline();
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
}

// Instrument Approach Chart (ILS or LOC RWY16L)
function drawILSRWY16L(){
    // 描画済み線を削除
    removePolyline();
    let waypoints = [
        [35.821527, 139.7341], // SANDY
        [35.821416, 139.68494], //LABAN
        [35.82127, 139.635], // LINEN
        [35.778472, 139.635194], // LORRY
        [35.56569252989162, 139.78671195194357] //16L
    ]
    polyline = L.polyline(waypoints, {color: 'blue'}).addTo(mymap);
}

function removePolyline(){
    // 初回描画時など，polylineが宣言されているが地図上に何も描画されていないときは，removeを行うとエラーになる．
    // ここで判定を行い，描画が存在するときのみ，その描画を削除する．
    if(polyline!=null){
        polyline.remove();
    }
}

function dummy(){
    removePolyline();
}


//Vincenty
const a = 6378137.06; //長軸半径（＝赤道半径）
const f = 1/298.257223563; //扁平率
const b = (1-f)*a; //短軸半径（極半径）
//度からラジアンへの変換
function getRad(x){
  return x/180*Math.PI;
}
//ラジアンから度への変換
function getArc(x){
  return x*180/ Math.PI;
}
//xのy乗を返す
function getPow(x, y){
  return Math.pow(x, y);
}

//vincenty順解法
//引数は緯度(rad)，経度(rad)，方位角(度)，距離(m)
function vincenty(lat, lng, az, length){
  let U1 = Math.atan((1-f)*Math.tan(lat));
  let sigma1 = Math.atan(Math.tan(U1) / Math.cos(az));
  let alpha = Math.asin(Math.cos(U1) * Math.sin(az));
  let u_sq = getPow(Math.cos(alpha), 2) * ((getPow(a, 2) - getPow(b,2)) / getPow(b,2));
  let A = 1 + (u_sq/16384) * (4096 + u_sq*(-768 + u_sq*(320-175*u_sq)));
  let B = (u_sq/1024) * (256 + u_sq*(-128 + u_sq*(74-47*u_sq)));
  let sigma = length/ b /A;
  //do{}の中で計算するが外でも使うのでここで宣言しとく
  let sigma_original;
  let sigma_m;
  do{
    sigma_original = sigma;    
    sigma_m = 2*sigma1 + sigma; 
    let pro1 = Math.cos(sigma)*(-1+2*getPow(Math.cos(sigma_m),2)) - B/6 * Math.cos(sigma_m)*(-3+4*getPow(Math.sin(sigma_m),2))*(-3+4*getPow(Math.cos(sigma_m),2)); //後式計算のための仮計算
    let deltaSigma = B * Math.sin(sigma) * (Math.cos(sigma_m) + B/4*pro1);
    sigma = length / b / A + deltaSigma;
  } while(Math.abs(sigma_original - sigma)>1e-9);
  
  let pro2child = Math.sin(U1) * Math.cos(sigma) + Math.cos(U1) * Math.sin(sigma) * Math.cos(az); //分子
  let pro2mom = (1 - f) * getPow ( getPow( Math.sin(alpha),2) + getPow( Math.sin(U1) * Math.sin(sigma) - Math.cos(U1) * Math.cos(sigma) * Math.cos(az) ,2) , 1 / 2); //分母
  let phi = Math.atan(pro2child/pro2mom);
  let lamda = Math.atan(Math.sin(sigma)*Math.sin(az)/(Math.cos(U1)*Math.cos(sigma)-Math.sin(U1)*Math.sin(sigma)*Math.cos(az)));
  let C = f / 16 * getPow(Math.cos(alpha),2) * (4 + f *(4- 3*getPow(Math.cos(alpha),2)));
  let L = lamda - (1-C)*f*Math.sin(alpha)* (sigma + C*Math.sin(sigma)* (Math.cos(sigma_m)+ C*Math.cos(sigma)*(-1 + 2* Math.cos(sigma_m),2)));
  return [getArc(phi), getArc(lng+L)];
}
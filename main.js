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
    drawIACILSRWY16R();

    //マップクリック時にその地点の緯度経度をconsole出力
    mymap.on('click', function(e) {      
        let clicked_position= e.latlng;
        console.log(clicked_position['lat'], clicked_position['lng']);      
      });
}

// Instrument Approach Chart (ILS or LOC RWY16R)
function drawIACILSRWY16R(){
    //polyline.remove();
    let waypoints = [
        [35.897472, 139.758694], //NATTY
        [35.8754, 139.7027], //RANGY
        [35.84083,139.615833], //RESIN
        [35.77416,139.6161], //RUGBY
        [35.55834352304508 ,139.7702078865645] //16R
    ]
    polyline = L.polyline(waypoints, {color: 'red'}).addTo(mymap);
}

function dummy(){
    polyline.remove();
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
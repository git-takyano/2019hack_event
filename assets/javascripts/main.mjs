/* global Y, axios */

/**
 * 検索結果
 * @typedef {Object} Feature
 * @property {string} Id 住所ID
 * @property {string} Gid グループID
 * @property {string} Name 地域・拠点情報名
 * @property {string} Description
 * @property {Geometry} Geometry
 * @property {Property} Property
 */

/**
 * 拠点の場所を表す要素
 * @typedef {Object} Geometry
 * @property {string} Type 図形種別
 * @property {string} Coordinates 座標情報
 */

/**
 * Yahoo!ジオコーダAPIを使って該当住所の位置情報を検索する
 * @param {string} query 検索したい住所のクエリ文字列
 * @return {Feature[]} 位置情報の一覧
 */
async function requestGeoCoderAPI(query) {
  const response = await axios({
    url: 'https://p8yfk8g0ah.execute-api.ap-northeast-1.amazonaws.com/test/geoCoder',
    params: {
      appid: 'dj00aiZpPUtybWsxMWsySG83SCZzPWNvbnN1bWVyc2VjcmV0Jng9ZTY-',
      query,
      output: 'json',
    },
  });
  const { data } = response;
  return data.ResultInfo.Count > 0 ? data.Feature : [];
}

/**
 * マップの中心を指定した位置情報に移動する
 * @param {YMap} map 表示するマップのインスタンス
 * @param {object} options 位置情報(lat, lng)を含んだパラメータ
 */
function drawMap(map, options) {
  const zoomLevel = 17;
  map.drawMap(new Y.LatLng(options.lat, options.lng), zoomLevel, Y.LayerSetId.NORMAL);
}

/**
 * ジオコーダAPIの検索結果のCoordinatesの文字列をパースして数値に変換する
 * @param {string} str 緯度経度を表す文字列
 * @return {object} 緯度(lat)経度(lng)
 */
function parseCoordinates(str) {
  // 入力Coordinatesは"経度,緯度"のフォーマットで来る
  const [lng, lat] = str.trim().split(',');
  return { lng: Number(lng), lat: Number(lat) };
}

/**
 * プログラムのエントリーポイント
 */
async function main() {
  const map = new Y.Map('map');
  drawMap(map, { lat: 35.68227528, lng: 139.73310240 });

  document.getElementById('form').onsubmit = () => {
    /** @type {string} テキストボックスの入力内容 */
    const query = document.getElementById('query').value;
    // ジオコーダAPIの検索結果を反映させる
    (async () => {
      const geoFeatures = await requestGeoCoderAPI(query);
      const resultText = document.getElementById('result-text');
      if (geoFeatures.length > 0) {
        const [first] = geoFeatures;
        const lct = parseCoordinates(first.Geometry.Coordinates);
        resultText.textContent = `場所: ${first.Name}, 緯度: ${lct.lat}, 経度: ${lct.lng}`;
        drawMap(map, lct);
      } else {
        resultText.textContent = '正しい住所を入力してください';
      }
    })();
    // 戻り値をfalseにして、formのsubmitが常に成功しないようにする
    return false;
  };
}

main();

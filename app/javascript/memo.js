function memo() {
  // DOMを取得している
  const submit = document.getElementById("submit");

  // 投稿ボタンをクリックした場合に実行する処理を定義している
  submit.addEventListener("click", (e) => {

    // フォームで入力された値を取得できるオブジェクト（FormData）を生成している
    const formData = new FormData(document.getElementById("form"));

    //　Ajaxで必要なオブジェクトを生成している
    const XHR = new XMLHttpRequest();

    // openでリクエストを初期化する
    // （どのようなリクエストをするのかを指定するのがopenメソッド）
    // 第一引数　HTTPメソッドの指定
    // 第二引数　パスの指定（routes.rb参照）
    // 第三引数　非同期通信のON/OFF（booleanで記述）
    XHR.open("POST", "/posts", true);

    // レスポンスの形式を指定している
    XHR.responseType = "json";
    
    //　sendでメモ投稿のフォームに入力された情報を送信する
    XHR.send(formData);

    // レスポンスなどの受信が成功した時の処理を記述する
    XHR.onload = () => {
      // レスポンスとして返却されたメモのレコードデータを取得している
      const item = XHR.response.post;

      // HTMLを描画する場所を指定する際に使用する「描画する親要素」のlistの要素を取得している
      const list = document.getElementById("list");

      // 「メモの入力フォーム」をリセットするために取得している
      // （この処理が終了した時に「入力フォームの文字は入力されたまま」になってしまう）
      const formText = document.getElementById("content");

      // 「メモとして描画する部分のHTML」を定義している
      const HTML = `
        <div class="post" data-id=${item.id}>
          <div class="post-date">
            投稿日時：${item.created_at}
          </div>
          <div class="post-content">
          ${item.content}
          </div>
        </div>`;

      // listという要素に対して、insertAdjacentHTMLでHTMLを追加している
      // （insertAdjacentHTMLは、指定したHTMLなどを、特定の要素に描画できるメソッド）
      list.insertAdjacentHTML("afterend", HTML);

      // 「メモの入力フォームに入力されたままの文字」はリセットされる
      // （正確には、からの文字列に上書きされるような仕組み）
      formText.value = "";

      if (XHR.status != 200) {

        // レスポンスのHTTPメソッドを解析し、該当するエラーメッセージをアラートで表示するようにしている
        alert(`Error ${XHR.status}: ${XHR.statusText}`);
      } else {
        return null;
      }
    };

    // リクエストが失敗した時
    XHR.onerror = function () {
      alert("Request failed");
    };

    // イベントをキャンセルして、処理が重複しないようにしている
    e.preventDefault();
  })
}

// 既読機能と同様にwindow（ページ）をload（読み込んだ時）にmemo関数が実行されるように記述する
window.addEventListener("load", memo);
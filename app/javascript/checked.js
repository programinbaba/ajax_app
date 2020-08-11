function check() {
  // 投稿のDOMを取得している
  const posts = document.getElementsByClassName("post");

  // 取得したDOMを配列に変換している
  postsA = Array.from(posts);

  postsA.forEach(function (post) {

    // 1度でも読み込んでいればpost.setAttribute("data-load", "true");を実行しdata-loadという要素を追加している    
    if (post.getAttribute("data-load") != null) {

      // 2回目以降はdata-loadがnullではないもの、すなわち読み込まれたことのある投稿の場合には、処理を中断させる記述をする
      return null;
    }
    post.setAttribute("data-load", "true");
    // 投稿をクリックした場合に実行する処理を定義している
    post.addEventListener("click", (e) => {
      
      // どの投稿をクリックしたのか、カスタムデータを利用して取得している
      const postId = post.getAttribute("data-id");

      // Ajaxに必要なオブジェクトを生成している
      const XHR = new XMLHttpRequest();

      // openでリクエストを初期化する
      // （どのようなリクエストをするのかを指定するメソッドがopen）
      // 第一引数の目的　HTTPメソッドの指定
      // 第二引数の目的　パスの指定（routes.rb参照）
      // 第三引数の目的　非同期通信のON/OFF（booleanで記述）
      XHR.open("GET", `/posts/${postId}`, true);

      // レスポンスのタイプを指定する
      XHR.responseType = "json";

      // sendでリクエストを送信する
      XHR.send();

      // レスポンスを受け取った時の処理を記述する
      XHR.onload = () => {
        const item = XHR.response.post;
        if (item.checked === true) {
          // 既読状態であれば、灰色に変わるcssを適用するためのカスタムデータを追加している
          post.setAttribute("data-check", "true");
        } else if (item.checked === false) {
          // 未読状態であれば、カスタムデータを削除している
          post.removeAttribute("data-check");
        }

        if (XHR.status != 200) {
          // レスポンスの HTTP ステータスを解析し、該当するエラーメッセージをアラートで表示するようにしている
          alert(`Error ${XHR.status}: ${XHR.statusText}`); // e.g. 404: Not Found
        } else {
          return null;
        }
      };
      // リクエストが送信できなかった時
      XHR.onerror = () => {
        alert("Request failed");
      };

      // イベントをキャンセルして、処理が重複しないようにしている
      e.preventDefault();
    });
  });
}

// check関数が1秒に1度実行されるように記述する
// （setIntervalは、一定の間隔（時間）ごとに指定した関数などを実行できるメソッド）
setInterval(check, 1000); // 時間はミリ秒
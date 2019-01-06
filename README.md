# ハンズオンコードサンプル

# 環境

Chrome 61+
Visual Studio Code

## インストールvscodeプラグイン

- Live Server
- （オプション）ESLint
    - eslintのnode_moduleを依存している. nodeを利用しないなら、このプラグインもインストールしなくて大丈夫

# 起動方法

同一オリジンポリシーを回避するために、Chromeの起動時にオプションを付けます。

Macのchromeユーザー
```
open http://localhost:5500/ -a "/Applications/Google Chrome.app" --args --disable-web-security --user-data-dir
```

Safariユーザー
https://qiita.com/kai_kou/items/54b61a274b77977add54
をご参照ください

その後vscodeのLive Serverを起動します（デフォルトのポートは5500）

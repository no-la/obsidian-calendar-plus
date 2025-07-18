# Obsidian Calendar Plus

[Obsidian Calendar](https://github.com/liamcain/obsidian-calendar-plugin) を拡張するためのプラグインです。

具体的には、Monthly note と Yearly note の作成・表示のためのボタンを、[Obsidian Calendar](https://github.com/liamcain/obsidian-calendar-plugin) で使われるカレンダーの「月」と「年」の HTML 要素に付け加えます。

したがって、このプラグインを使うためには以下が必要です。

- [Obsidian Calendar](https://github.com/liamcain/obsidian-calendar-plugin) が入っていること
- [Obsidian Calendar](https://github.com/liamcain/obsidian-calendar-plugin) のカレンダーが開かれていること


## 導入

このリポジトリを clone し、ルートディレクトリで

```sh
npm install
npm run build
```

を実行後、`Your Vault/.obsidian/plugins/calendar-plus/` に `main.js`、`manifest.json`、`style.css` をコピーしてください。
その後、他のプラグインと同様の操作で使用することが出来ます。

起動後数秒後にポップアップが表示され、ボタンが使えるようになります。

> [!NOTE]
> 設定の変更が反映されない場合、Options > Community plugins > Installed plugins のトグルを切り替えて、Calendar Plus をリロードしてください。

## Template について

Monthly note、Yearly note それぞれについて、テンプレートを作ることが出来ます。
テンプレートでは、以下のようなプレースホルダーを使うと、note 作成時にその note の月・年の最初の日が、指定したフォーマットで挿入されます。

- `{{date}}`
- `{{date:YYYY-MM-DD}}`

例えば、`{{date:🕰️YYYY-MM-DD}}` というプレースホルダーは、2025/06 の Monthly note において、`🕰️2025-06-01` に変換されます。
また、`{{date}}` については、Month Format、Year Format で指定したフォーマットで変換されます。



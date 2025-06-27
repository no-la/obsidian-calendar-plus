# Obsidian Calendar Plus

[Obsidian Calendar](https://github.com/liamcain/obsidian-calendar-plugin) を拡張するためのプラグインです。

具体的には、Monthly note と Yearly note の作成・表示のためのボタンを、Obsidian Calendar で使われるカレンダーの「月」と「年」の HTML 要素に付け加えます。

したがって、このプラグインを使うためには以下が必要です。

- [Obsidian Calendar](https://github.com/liamcain/obsidian-calendar-plugin) が入っていること
- [Obsidian Calendar](https://github.com/liamcain/obsidian-calendar-plugin) のカレンダーが開かれていること

通常の方法で、ビルド、デプロイをして、上記を確認した上で使用してください。

## Template について

Monthly note、Yearly note それぞれについて、テンプレートを作ることが出来ます。
テンプレートでは、以下のようなプレースホルダーを使うと、note 作成時にその note の月・年の最初の日が、指定したフォーマットで挿入されます。

- `{{date}}`
- `{{date:YYYY-MM-DD}}`

例えば、`{{date:🕰️YYYY-MM}}` というプレースホルダーは、2025/06 の note において、`🕰️2025-06` に変換されます。
また、`{{date}}` については、Month Format、Year Format で指定したフォーマットで変換されます。

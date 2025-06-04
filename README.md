# qidian-decryptor

基于 JavaScript 的起点网页章节解密工具。用于解析 VIP 章节内容, 仅供个人备份和学习使用。

## 输入格式

提供一个 JSON 文件, 格式如下:

```json
[
  "<encryptedContent>",
  "<chapterId>",
  "<fkp>",
  "<fuid>"
]
```

字段说明:

* `encryptedContent`: 章节的加密内容
* `chapterId`: 章节 ID
* `fkp`: 起点提供的密钥调用片段 (base64 编码)
* `fuid`: 当前用户 UID

## 如何提取数据 (Python 示例)

以下是从已加载的起点章节 HTML 页面中提取上述字段的示例代码:

<details>
<summary>完整 Python 示例代码 (点击展开)</summary>

```python
import json
from typing import Any
from lxml import html

def find_ssr_page_context(html_str: str) -> dict[str, Any]:
    """
    Extract SSR JSON from <script id="vite-plugin-ssr_pageContext">.
    """
    try:
        tree = html.fromstring(html_str)
        script = tree.xpath('//script[@id="vite-plugin-ssr_pageContext"]/text()')
        if script:
            data: dict[str, Any] = json.loads(script[0].strip())
            return data
    except Exception as e:
        print("[Parser] SSR JSON parse error: %s", e)
    return {}

if __name__ == "__main__":
    fuid = "54321"  # 当前登录用户的 UID
    with open("123456.html", "r", encoding="utf-8") as f:
        raw_html = f.read()

    ssr_data = find_ssr_page_context(raw_html)
    page_context = ssr_data.get("pageContext", {})
    page_props = page_context.get("pageProps", {})
    page_data = page_props.get("pageData", {})
    chapter_info = page_data.get("chapterInfo", {})

    en_content = chapter_info.get("content")
    chapter_id = chapter_info.get("chapterId")
    fkp = chapter_info.get("fkp")

    # 构造 decryptor 输入
    input_data = [en_content, chapter_id, fkp, fuid]
    with open("input.json", "w", encoding="utf-8") as out:
        json.dump(input_data, out, ensure_ascii=False)
```
</details>

## 使用方式

```bash
node decrypt.js input.json output.txt
```

注意: 如果指定的输出路径包含目录, 请确保该目录已存在。

## 打包为可执行文件

使用 [pkg](https://github.com/vercel/pkg) 打包为跨平台可执行文件:

```bash
npm install
npm run build
```

打包结果输出到 `dist/` 目录, 可直接运行:

```bash
./dist/qidian-decryptor-win.exe input.json output.txt
```

## 免责声明

本工具仅供个人使用, 请勿将解密内容用于非法传播或商业用途。

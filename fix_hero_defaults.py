from pathlib import Path

store = Path(r"src/store/useLuminaStore.ts")
text = store.read_text(encoding="utf-8")
text = text.replace("      paddingY: 56,", "      paddingY: type === 'HeroBlock' ? 120 : 56,")
text = text.replace('{title || "Build faster with premium sections"}', '{title || "Hero Section"}')
store.write_text(text, encoding="utf-8")
print('updated')

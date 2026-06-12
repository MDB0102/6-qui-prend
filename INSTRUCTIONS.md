# Ce qu'il faut ajouter dans ton index.html existant

## Dans le <head>, ajoute ces lignes :

```html
<link rel="manifest" href="manifest.json" />
<meta name="theme-color" content="#e74c3c" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="6 qui prend" />
<link rel="apple-touch-icon" href="icons/icon-192.png" />
```

## Avant </body>, ajoute ce script :

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('✓ App installable hors ligne'))
        .catch((err) => console.warn('SW error:', err));
    });
  }
</script>
```

---

## Activer GitHub Pages :

1. Ton repo → **Settings**
2. Menu gauche → **Pages**
3. Source → Branch: `principal` → dossier: `/ (root)`
4. **Save**
5. URL : `https://mdb0102.github.io/6-qui-prend`

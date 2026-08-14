# GitHub Pages yayınlama

Bu proje GitHub Actions ile otomatik yayınlanır.

## 1. GitHub hesabı ve repo

1. [github.com](https://github.com) hesabı aç / giriş yap
2. **New repository** → örnek ad: `arapca`
3. Public seç, **Create repository**

## 2. Git kur (bilgisayarda yoksa)

Windows: [Git for Windows](https://git-scm.com/download/win) kur, Cursor’ı yeniden aç.

## 3. Projeyi GitHub’a gönder

PowerShell’de proje klasöründe:

```powershell
cd C:\Users\melte\Cursor\Arapca
git init
git add .
git commit -m "Initial commit: Arapca calisma uygulamasi"
git branch -M main
git remote add origin https://github.com/KULLANICIADI/arapca.git
git push -u origin main
```

`KULLANICIADI` ve `arapca` kısımlarını kendi GitHub kullanıcı adın ve repo adınla değiştir.

## 4. Pages ayarı

Repo sayfasında:

1. **Settings → Pages**
2. **Source:** GitHub Actions

İlk push’tan sonra **Actions** sekmesinde `Deploy GitHub Pages` yeşile dönünce site hazırdır.

Adres:

`https://KULLANICIADI.github.io/arapca/`

(Repo adın farklıysa URL’deki son kısım da o olur.)

## Notlar

- `node_modules` GitHub’a gitmez; Actions içinde kurulur
- Her `main` push’unda site yeniden yayınlanır
- İlerleme verisi kullanıcının tarayıcısında kalır (hesap yok)

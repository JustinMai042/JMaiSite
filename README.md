# JMaiSite

An editable Quarto portfolio with a responsive green visual system, light and dark themes, and subtle JavaScript interactions. The generated website is published from `docs/`.

## Edit and preview

Open `JMaiSite.Rproj` in RStudio, edit the `.qmd` files, and use **Render Website** or **Run Current** to preview changes.

From a terminal with Quarto on `PATH`:

```powershell
quarto preview
```

## Render for GitHub Pages

```powershell
quarto render
```

The rendered website is written to `docs/`, which is the folder configured for GitHub Pages.

## Project structure

- `assets/images/` contains portraits, branding, and image assets.
- `assets/documents/` contains résumés, reports, and presentation files.
- `assets/demos/` contains standalone interactive demos.
- `includes/` contains shared Quarto HTML includes.
- `docs/` is generated output; edit the source files instead.

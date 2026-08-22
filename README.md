# Movie App - Salesforce DX Project

Salesforce Lightning Web Components (LWC) conversion of the Movie React application to view popular movies and manage favourites.

## Architecture & Components

This project is structured as a standard Salesforce DX project (`force-app/main/default/lwc/`):

- **`navbar`**: Top navigation header for switching between Movies home page and Favourites page.
- **`banner`**: Displays featured trending movie backdrop image, title, and overview fetched from TheMovieDB API.
- **`movieList`**: Renders popular movie cards grid with hover overlay, pagination (Previous/Next), and "Add to / Remove from Favourites" functionality.
- **`favourites`**: Favourites management table with genre filtering sidebar, title search box, page size selector, and delete action.
- **`movieAppContainer`**: Parent component integrating all child components with active view state management.

## Project Structure

```
├── sfdx-project.json
├── .forceignore
├── force-app/
│   └── main/
│       └── default/
│           └── lwc/
│               ├── navbar/
│               ├── banner/
│               ├── movieList/
│               ├── favourites/
│               └── movieAppContainer/
```

## Deployment & Usage

1. Authenticate to your Salesforce org via SFDX CLI:
   ```bash
   sfdx auth:web:login -a my-org
   ```
2. Deploy source to your Salesforce org:
   ```bash
   sfdx force:source:deploy -p force-app
   ```
3. Add `movieAppContainer` or individual LWCs to App Pages or Home Pages via Salesforce Lightning App Builder.

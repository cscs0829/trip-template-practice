# Trippage Website

This is the Trippage website project.

## Recent Changes

### Pagination Unification

The pagination logic and styling across `board.html`, `destination.html`, and `gallery.html` have been unified.

*   A new reusable JavaScript file, `js/pagination.js`, was created to handle common pagination rendering logic.
*   Each page now uses this generic function, reducing code duplication and ensuring consistent pagination behavior and appearance.
*   Hardcoded pagination HTML in `destination.html` and `board.html` has been replaced with dynamic rendering via JavaScript.
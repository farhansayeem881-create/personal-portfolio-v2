PERSONAL PORTFOLIO — HTML, CSS & JAVASCRIPT

STRUCTURE
- index.html: Home page
- academic.html, publication.html, certificate.html, projects.html, others.html: Separate pages
- data/: JSON files for each content category
- assets/images/: Store profile, project, award, and certificate images
- css/style.css: Shared styling
- js/app.js: JSON rendering and navigation behavior
- js/theme.js: Persistent dark/light mode

RUN LOCALLY
JSON files are loaded with fetch(), so do not open index.html directly with file://.
Open a terminal in this folder and run:
    python -m http.server 8000
Then visit:
    http://localhost:8000

CUSTOMIZE
1. Replace "Your Name", email, and social links in the HTML files.
2. Add your portrait as assets/images/profile.jpg.
3. Edit the JSON files in data/ to update academic details, skills, awards, projects, publications, and certificates.
4. Add images to assets/images/ and set the image filename in the corresponding JSON item.
5. Update publication titles and certificate links with verified information.

All interface text is English. Each navigation item opens a separate HTML page.


ADMIN DASHBOARD
1. Install Node.js (LTS).
2. Open a terminal in this project folder and run: npm install
3. Set a password and start the server:
   Windows PowerShell:
      $env:ADMIN_PASSWORD="choose-a-strong-password"
      npm start
   macOS / Linux:
      ADMIN_PASSWORD="choose-a-strong-password" npm start
4. Open http://localhost:8000/admin.html and sign in.

The dashboard can add, edit, and delete projects, academic entries, publications,
certificates, skills, awards, and other content. It saves each category to its
matching JSON file in data/. Uploaded images are stored in assets/images/.

The admin dashboard requires a Node.js server and will not work on static-only
hosting such as GitHub Pages. Use a strong password and HTTPS for public hosting.
Back up data/ and assets/images/ regularly.

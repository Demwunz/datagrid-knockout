# DataGrid Test

Development code is in app/  
Production code is in dist/


### Demo

[https://c9.io/demwunz_1/reuterstest/workspace/dist/index.html](https://c9.io/demwunz_1/reuterstest/workspace/dist/index.html)

### Data source

[https://docs.google.com/spreadsheet/ccc?key=0Akt_os3oK7whdHlVWDl5Rk5TMkJHaW5mRm9kYjJKLXc#gid=0](https://docs.google.com/spreadsheet/ccc?key=0Akt_os3oK7whdHlVWDl5Rk5TMkJHaW5mRm9kYjJKLXc#gid=0)

### Libraries used:

- [RequireJS](http://www.requirejs.org/)
- [Knockout](http://knockoutjs.com/)
- [bean](https://github.com/fat/bean)
- [reqwest](https://github.com/ded/reqwest)

### Tools used:

- [Yeoman](http://yeoman.io/)
- [Compass](http://compass-style.org/)
- [SublimeText](http://www.sublimetext.com/3)
- [Cloud9 IDE](https://c9.io/demwunz_1/reuterstest)

### Missing features

- missing feature: table header triangles on column sorting
 	- reason: time constraints

### Bugs

column sorting only happens twice (ascending, descending).  
*update: fixed in commit [c595d62](https://bitbucket.org/demwunz/reuters/commits/c595d6255f01184fedeac5ee15178a59281283f9) - post test submission date. did for fun.*

### What could have been done better

- fixed table header on scroll.
- flexbox rendering for layout.
- more abstraction via requirejs. For example, the "table cell objects" could have been moved to their own file.
- tests written
- cleaner more structured sass file


*update: I am going to build this in angular, this was a fun test!*
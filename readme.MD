# DataGrid Test

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
- [Cloud9 IDE](https://c9.io/)

### Missing features

- missing feature: table header triangles on column sorting  
 	- reason: time constraints

### Bugs

column sorting only happens twice (ascending, descending).

### What could have been done better 

- fixed table header on scroll. 
- flexbox rendering for layout.
- more abstraction via requirejs. For example, the "table cell objects" could have been moved to their own file.
- tests written
# simplehtm

Simple HTM implementation being constructed for [Building HTM Systems](https://github.com/htm-community/building-htm-systems) and some random blog entries like [this one](https://numenta.com/blog/2018/05/25/how-grid-cells-map-space/).

### Work In Progress

This is incomplete. I'm building it as I go. Currently only contains some encoders, but they are [being used](https://buildinghtm.systems/encoding-numbers/). 

### Test

    npm test
    
### Build Webpack

    npm start

Will overwrite whatever is at `docs/simplehtm-{version}.js`. Contents of `docs` are available at <https://htm-community.github.io/simplehtm/> (that's how I currently deploy changes).

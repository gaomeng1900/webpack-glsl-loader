# Webpack loader for GLSL shaders

Just like https://github.com/grieve/webpack-glsl-loader.

Except using `#import <./filaneme>` instead of `@import ./filename`.

To make llvm code styler work.

Also adding syntactic sugar: `#import <./a>` == `#import <a>`.


## Install

```shell
npm install --save-dev @simon.gm/webpack-glsl-loader
```

## TODO

- [ ] Ignore commented code.
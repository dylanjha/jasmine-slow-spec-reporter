# Jasmine Slow Spec Reporter

When you run your test suite, have jasmine output the slow tests.

This is inspired by one of the lessons in the [Code Quality Challenge](https://www.codequalitychallenge.com/).

Slow tests are a drag on your whole development process. Especially over a long period of time it's easy to end up with 
a test suite that takes a long time to run and that discourages developers from adding more tests.

## Usage

```
yarn add jasmine-slow-spec-reporter --dev
```

OR

```
npm install jasmine-slow-spec-reporter --save-dev
```

```javascript
const SlowSpecReporter = require('jasmine-slow-spec-reporter')
jasmine.addReporter(new SlowSpecReporter())
```

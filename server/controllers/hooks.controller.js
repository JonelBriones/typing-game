export function sort(users, tests) {
  function getHighestTest() {
    let result = [];
    users.forEach((user) => {
      const userTests = tests.filter((test) => test.user === user.username);
      if (userTests.length === 0) return;

      let highestTest = userTests[0];

      tests.forEach((test) => {
        if (test.user == user.username && test.wpm > highestTest.wpm) {
          highestTest = test;
        }
      });

      result.push(highestTest);
    });
    return result;
  }
  return getHighestTest().sort((prev, current) => current.wpm - prev.wpm);
}

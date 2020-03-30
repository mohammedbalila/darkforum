const { User } = require('./models');

const removeUnConfirmed = async () => {
  // time now
  const now = Date.now();
  // 20 mins == 1200 seconds
  // transfer 1200 seconds to milliseconds
  // subtract form now
  const time20MinsAgo = now - 1200 * 1000;
  const resp = await User.updateMany(
    {
      isConfirmed: false,
      createdAt: {
        $gte: new Date(time20MinsAgo),
      },
    },
    { hash: '' },
  );
  console.log(resp);
};

module.exports = { removeUnConfirmed };

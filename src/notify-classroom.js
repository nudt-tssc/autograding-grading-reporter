const core = require("@actions/core");
 
exports.NotifyClassroom = async function NotifyClassroom(runnerResults) {
  // combine max score and total score from each {runner, results} pair
  // if max_score is greater than 0 run the rest of this code
  const { totalPoints, maxPoints } = runnerResults.reduce(
    (acc, { results }) => {
      if (!results.max_score) return acc;

      acc.maxPoints += results.max_score;
      results.tests.forEach(({ score }) => {
        acc.totalPoints += score;
      });

      return acc;
    },
    { totalPoints: 0, maxPoints: 0 }
  );
  if (!maxPoints) return;
  const allTotalPoints = runnerResults.map(({ results }) => {
      // 如果没有 max_score，返回 "00000/00000"
      if (!results.max_score) return "0000000000";
      
      // 计算当前 runner 的总分
      const totalPoints = results.tests.reduce((sum, { score }) => sum + score, 0);
      const maxPoints = results.max_score;
      
      // 将分数格式化为5位数，不足5位前面补0
      const formattedTotal = String(totalPoints).padStart(5, '0');
      const formattedMax = String(maxPoints).padStart(5, '0');
      
      // 返回当前 runner 的格式化结果
      return `${formattedTotal}${formattedMax}`;
  }).join('');


  
  const allMaxPoints = runnerResults.map(({ results }) => {
    if (!results.max_score) return "00000";
    return String(results.max_score).padStart(5, '0');
  }).join('');
  
  const text = `Points ${allTotalPoints}/1`;
  const summary = JSON.stringify({ totalPoints, maxPoints })

  // create notice annotations with the final result and summary
  core.notice(text, {
    title: "Autograding complete",
  })

  core.notice(summary, {
    title: "Autograding report",
  })
};

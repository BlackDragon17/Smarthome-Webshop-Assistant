switch (window.taskNumber) {
    case 0:
        window.questionId = "563851X974X15289";
        import("tutorial-question.js");
        break;
    case 1:
        window.questionId = "563851X975X15290";
        import("task-question.js");
        break;
    case 2:
        window.questionId = "563851X976X15292";
        import("task-question.js");
        break;
    case 3:
        window.questionId = "563851X1004X15664";
        import("task-question.js");
        break;
    case 4:
        break;
    case 5:
        window.questionId = "563851X1016X16181";
        import("task-question.js");
        break;
    default:
        throw new Error(`Invalid taskNumber set! taskNumber: ${window.taskNumber}`);
}

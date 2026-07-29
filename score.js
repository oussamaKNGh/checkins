// =======================================
// SCORE ENGINE
// Calculates the overall inspection score
// =======================================

const SCORE_WEIGHTS = {

    cpu:          { field: "cpuStatus",        weight: 15 },
    gpu:          { field: "gpuStatus",        weight: 15 },
    ram:          { field: "ramStatus",        weight: 10 },
    storage:      { field: "storageStatus",    weight: 15 },
    motherboard:  { field: "motherboardStatus",weight: 10 },
    psu:          { field: "psuStatus",        weight: 10 },
    cooling:      { field: "coolingStatus",    weight: 5  },
    pcCase:       { field: "caseStatus",       weight: 5  },
    monitor:      { field: "monitorStatus",    weight: 5  },
    battery:      { field: "batteryStatus",    weight: 5  },
    network:      { field: "networkStatus",    weight: 5  }

};

function calculateChecklistScore(){

    const items = DATA.checklist;

    const total = items.length;

    if(total === 0) return 100;

    const checked = items.filter(item=>{

        return report.checklist && report.checklist[item.id];

    }).length;

    return Math.round((checked / total) * 100);

}

function calculateComponentScore(){

    let totalWeight = 0;

    let weightedSum = 0;

    Object.keys(SCORE_WEIGHTS).forEach(section=>{

        const { field, weight } = SCORE_WEIGHTS[section];

        const sectionData = report[section] || {};

        const condition = sectionData[field];

        const score = conditionToScore(condition);

        if(score !== null){

            weightedSum += score * weight;

            totalWeight += weight;

        }

    });

    if(totalWeight === 0) return null;

    return Math.round(weightedSum / totalWeight);

}

function calculateOverallScore(){

    const componentScore = calculateComponentScore();

    const checklistScore = calculateChecklistScore();

    let overall;

    if(componentScore === null){

        overall = checklistScore;

    } else {

        overall = Math.round((componentScore * 0.7) + (checklistScore * 0.3));

    }

    overall = clamp(overall, 0, 100);

    report.score.overall = overall;

    report.score.componentScore = componentScore;

    report.score.checklistScore = checklistScore;

    report.score.grade = scoreToGrade(overall);

    return report.score;

}

function scoreToGrade(score){

    if(score >= 90) return { label: "ممتاز", badge: "badge-excellent" };

    if(score >= 75) return { label: "جيد", badge: "badge-good" };

    if(score >= 55) return { label: "متوسط", badge: "badge-average" };

    if(score >= 35) return { label: "يحتاج صيانة", badge: "badge-needs-service" };

    return { label: "معطوب", badge: "badge-damaged" };

}
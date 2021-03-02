const URL =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

const table = document.getElementById("main-table");
const tableCorrelation = document.getElementById("correlation-table");
fetch(URL)
  .then((res) => res.json())
  .then(handleResponse);

function handleResponse(list) {
  let eventosInfo = {};
  list.forEach((element, i) => {
    let row = document.createElement("tr");
    let col = document.createElement("th");
    col.textContent = i + 1;
    row.appendChild(col);

    Object.values(element).forEach((i) => {
      col = document.createElement("th");
      col.textContent = i;
      row.appendChild(col);
    });

    if (element.squirrel) {
      row.style.backgroundColor = "#FFBFCB";
    }

    table.appendChild(row);

    let eventosEnLista = element.events;
    eventosEnLista.forEach((evento) => {
      if (eventosInfo[evento] == undefined) {
        let eventInfo = {};
        eventInfo["event"] = evento;
        eventInfo.TP = list.filter(
          (el) => el.events.includes(evento) && el.squirrel
        ).length;
        eventInfo.FP = list.filter(
          (el) => !el.events.includes(evento) && el.squirrel
        ).length;
        eventInfo.TN = list.filter(
          (el) => !el.events.includes(evento) && !el.squirrel
        ).length;
        eventInfo.FN = list.filter(
          (el) => el.events.includes(evento) && !el.squirrel
        ).length;
        eventInfo.MCC =
          (eventInfo.TP * eventInfo.TN - eventInfo.FP * eventInfo.FN) /
          Math.sqrt(
            (eventInfo.TP + eventInfo.FP) *
              (eventInfo.TP + eventInfo.FN) *
              (eventInfo.TN + eventInfo.FP) *
              (eventInfo.TN + eventInfo.FN)
          );
        eventosInfo[evento] = eventInfo;
      }
    });
  });

  eventosInfo = Object.values(eventosInfo);
  eventosInfo.sort((a, b) => b.MCC - a.MCC);
  eventosInfo.forEach((element, i) => {
    let row = document.createElement("tr");
    let col = document.createElement("th");
    col.textContent = i + 1;
    row.appendChild(col);
    col = document.createElement("th");
    col.textContent = element.event;
    row.appendChild(col);
    table.appendChild(row);
    col = document.createElement("th");
    col.textContent = element.MCC;
    row.appendChild(col);
    tableCorrelation.appendChild(row);
  });
}

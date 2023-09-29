let pageno = 1;

function findLCM(arr) {
  function lcm(a, b) {
    return (a * b) / gcd(a, b);
  }

  function gcd(a, b) {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  }

  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = lcm(result, arr[i]);
  }
  return result;
}

function EDFChecked() {
  let checkbox = document.querySelector("#EDF");
  if (checkbox.checked) {
    document.getElementById("RMS").disabled = true;
  } else {
    document.getElementById("RMS").disabled = false;
  }
}
function RMSChecked() {
  let checkbox = document.querySelector("#RMS");
  if (checkbox.checked) {
    document.getElementById("EDF").disabled = true;
  } else {
    document.getElementById("EDF").disabled = false;
  }
}
function ForwardFunction() {
  if (pageno < 4) {
    pageno++;
    console.log(pageno);
  }
  if (pageno == 2) {
    if (
      document.getElementById("RMS").checked ||
      document.getElementById("EDF").checked
    ) {
      document.getElementById("selection-alert").style.display = "none";

      document.getElementById("process-count").style.display = "flex";
    } else {
      document.getElementById("selection-alert").style.display = "flex";
      document.getElementById("selection-alert").innerText =
        "Please Select one Scheduling Algorithm";
    }
  }
  if (pageno == 3) {
    console.log(pageno);
    if (document.getElementById("no-of-processes").value != "") {
      let n = document.getElementById("no-of-processes").value;
      document.getElementById("process-alert").style.display = "none";

      //in case of rms
      if (document.getElementById("RMS").checked) {
        document.getElementById("RMS-table").style.display = "flex";
        let string = "";
        for (let i = 0; i < n; i++) {
          string += `
                    <tr>
                    <td>${i}</td>
                    <td><input id="P${i}" type="number" class="no-of-processes" placeholder="Period Time"></td>
                    <td><input id="E${i}" type="number" class="no-of-processes" placeholder="Execution Time"></td>
    
    
                    </tr>
                    `;
        }
        console.log(string);
        document.getElementById("tableBody").innerHTML = string;
      }
      // in case of edf write code here
      else {
        document.getElementById("EDF-table").style.display = "flex";
        let string = "";
        for (let i = 0; i < n; i++) {
          string += `
                    <tr>
                    <td>${i}</td>
                    <td><input id="P${i}" type="number" class="no-of-processes" placeholder="Period Time"></td>
                    <td><input id="E${i}" type="number" class="no-of-processes" placeholder="Execution Time"></td>
    
    
                    </tr>
                    `;
        }
        console.log(string);
        document.getElementById("tableBody2").innerHTML = string;
      }
    } else {
      document.getElementById("process-alert").style.display = "flex";

      document.getElementById("process-alert").innerText =
        "Please Enter No of Processes";
    }
  }
  if (pageno == 4) {
    if (document.getElementById("RMS").checked) {
      let n = document.getElementById("no-of-processes").value;
      let check = true;
      for (let i = 0; i < n; i++) {
        if (document.getElementById(`P${i}`).value != "") {
        } else {
          check = false;
        }
        if (document.getElementById(`E${i}`).value != "") {
        } else {
          check = false;
        }
      }
      if (check === true) {
        let Period = [];
        let process = [];
        let ExecutionTime = [];
        let color = [];

        let string = "";
        for (let i = 0; i < n; i++) {
          let val1 = parseInt(document.getElementById(`P${i}`).value);
          let val2 = parseInt(document.getElementById(`E${i}`).value);
          var randomColor = Math.floor(Math.random() * 16777215).toString(16);
          // add the values to the respective arrays
          Period.push(val1);
          ExecutionTime.push(val2);
          color.push(randomColor);
          process.push(i);
          string += `
          <div>
           <p class="me-2">P${i} : <button class="p-3" style="background-color:${color[i]};"></button>
           </p>
           </div>
          `;
        }
        document.getElementById("rms-gantt-chart").style.display = "flex";

        document.getElementById("rms-gantt-chart").innerHTML = string;
        console.log(process);

        for (let i = 0; i < n - 1; i++) {
          for (let j = i + 1; j < n; j++) {
            if (Period[process[i]] > Period[process[j]]) {
              let temp = process[i];
              process[i] = process[j];
              process[j] = temp;
            }
          }
        }
        let CurrentExecTime = [];
        for (let i = 0; i < n; i++) {
          CurrentExecTime[i] = 0;
        }
        //rms algo here()
        let lcm = findLCM(Period);
        string = "";
        let time = 0;
        let j = 0;
        let k = 0;
        let scale = "";

        for (let i = 0; i < lcm; i++) {
          j = 0;

          if (k < n) {
            if (time % 5 == 0) {
              scale = `${i}`;
            } else {
              scale = "";
            }
            string += `<button class="py-3" style="font-size:10px;background-color:${
              color[process[k]]
            };">${scale}</button>`;
          } else {
            if (time % 5 == 0) {
              scale = `${i}`;
            } else {
              scale = "";
            }
            string += `<button class="py-3" style="font-size:10px;border:none;background-color:white;">${scale}</button>`;
          }

          time++;

          CurrentExecTime[process[k]] = CurrentExecTime[process[k]] + 1;

          for (let m = 0; m < n; m++) {
            if (time % Period[process[m]] == 0) {
              if (CurrentExecTime[process[m]] < ExecutionTime[process[m]]) {
                document.getElementById("input-alert").style.display = "flex";
                document.getElementById(
                  "input-alert"
                ).innerText = `process ${process[m]} missed deadline.`;
                document.getElementById("chart").style.display = "block";
                document.getElementById("chart").innerHTML = string;
                return 0;
              }
              CurrentExecTime[process[m]] = 0;
            }
          }
          // if the process has completed its execution time then find the one which hasn't
          while (CurrentExecTime[process[k]] >= ExecutionTime[process[k]]) {
            k++;
          }
          //if a previous process having lesser period has reached its entry time the let it enter
          while (j < k) {
            if (time % Period[process[j]] == 0) {
              k = j;
              CurrentExecTime[process[k]] = 0;
              break;
            }
            j++;
          }
        }

        document.getElementById("chart").style.display = "block";
        document.getElementById("chart").innerHTML = string;
      } else {
        document.getElementById("input-alert").style.display = "flex";
        document.getElementById("input-alert").innerText =
          "Please fill all the fields";
      }
    } else {
      let n = document.getElementById("no-of-processes").value;
      let check = true;
      for (let i = 0; i < n; i++) {
        if (document.getElementById(`P${i}`).value != "") {
        } else {
          check = false;
        }
        if (document.getElementById(`E${i}`).value != "") {
        } else {
          check = false;
        }
      }
      if (check == true) {
        let Period = [];
        let process = [];
        let ExecutionTime = [];
        let color = [];

        let string = "";
        for (let i = 0; i < n; i++) {
          let val1 = parseInt(document.getElementById(`P${i}`).value);
          let val2 = parseInt(document.getElementById(`E${i}`).value);
          var randomColor = Math.floor(Math.random() * 16777215).toString(16);
          // add the values to the respective arrays
          Period.push(val1);
          ExecutionTime.push(val2);
          color.push(randomColor);
          process.push(i);
          string += `
          <div>
           <p class="me-2">P${i} : <button class="p-3" style="background-color:${color[i]};"></button>
           </p>
           </div>
          `;
        }
        document.getElementById("rms-gantt-chart").style.display = "flex";

        document.getElementById("rms-gantt-chart").innerHTML = string;

        for (let i = 0; i < n - 1; i++) {
          for (let j = i + 1; j < n; j++) {
            if (Period[process[i]] > Period[process[j]]) {
              let temp = process[i];
              process[i] = process[j];
              process[j] = temp;
            }
          }
        }
        let CurrentExecTime = [];
        for (let i = 0; i < n; i++) {
          CurrentExecTime[i] = 0;
        }
        //rms algo here()
        let lcm = findLCM(Period);
        string = "";
        let time = 0;
        let j = 0;
        let k = 0;
        let scale = "";

        for (let i = 0; i < lcm; i++) {
          j = 0;

          if (k < n) {
            if (time % 5 == 0) {
              scale = `${i}`;
            } else {
              scale = "";
            }
            string += `<button class="py-3" style="font-size:10px;background-color:${
              color[process[k]]
            };">${scale}</button>`;
          } else {
            if (time % 5 == 0) {
              scale = `${i}`;
            } else {
              scale = "";
            }
            string += `<button class="py-3" style="font-size:10px;border:none;background-color:white;">${scale}</button>`;
          }

          time++;

          CurrentExecTime[process[k]] = CurrentExecTime[process[k]] + 1;

          for (let m = 0; m < n; m++) {
            if (time % Period[process[m]] == 0) {
              if (CurrentExecTime[process[m]] < ExecutionTime[process[m]]) {
                document.getElementById("input-alert").style.display = "flex";
                document.getElementById(
                  "input-alert"
                ).innerText = `process ${process[m]} missed deadline.`;
                document.getElementById("chart").style.display = "block";
                document.getElementById("chart").innerHTML = string;
                return 0;
              }
              CurrentExecTime[process[m]] = 0;
            }
          }

          let closestDeadline = Number.MAX_SAFE_INTEGER;
          let checkForChange = false;
          while (CurrentExecTime[process[k]] >= ExecutionTime[process[k]]) {
            checkForChange = true;
            k++;
          }
          if (!checkForChange) {
            for (let m = 0; m < n; m++) {
              if (time % Period[process[m]] == 0) {
                checkForChange = true;
              }
            }
          }
          if (checkForChange) {
            for (let m = 0; m < n; m++) {
              let nearest_multiple =
                (Math.floor(time / Period[process[m]]) + 1) *
                Period[process[m]];
              if (
                nearest_multiple < closestDeadline &&
                CurrentExecTime[process[m]] < ExecutionTime[process[m]]
              ) {
                closestDeadline = nearest_multiple;
                k = m;
              }
            }
          }
        }

        /////////////////////////////////////////

        document.getElementById("chart").style.display = "block";
        document.getElementById("chart").innerHTML = string;
      } else {
        document.getElementById("input-alert").style.display = "flex";
        document.getElementById("input-alert").innerText =
          "Please fill all the fields";
      }
    }
  }
}
function BackFunction() {
  if (pageno > 1) {
    pageno--;
  }
  if (pageno == 1) {
    document.getElementById("process-count").style.display = "none";

    document.getElementById("selection-alert").style.display = "none";
  }
  if (pageno == 2) {
    console.log(pageno);

    document.getElementById("process-alert").style.display = "none";
    document.getElementById("RMS-table").style.display = "none";
    document.getElementById("EDF-table").style.display = "none";
  }
  if (pageno == 3) {
    document.getElementById("rms-gantt-chart").style.display = "none";
    document.getElementById("input-alert").style.display = "none";
    document.getElementById("chart").style.display = "none";
  }
}

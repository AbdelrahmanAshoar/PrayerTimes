function getTimeDate() {
  let date = new Date();
  let month = date.getMonth();
  let day = date.getDay();
  switch (month) {
    case 0:
      month = "يناير"
      break;
    case 1:
      month = "فبراير"
      break;
    case 2:
      month = "مارس"
      break;
    case 3:
      month = "أبريل"
      break;
    case 4:
      month = "مايو"
      break;
    case 5:
      month = "يونيو"
      break;
    case 6:
      month = "يوليو"
      break;
    case 7:
      month = "أغسطس"
      break;
    case 8:
      month = "سبتمبر"
      break;
    case 9:
      month = "أكتوبر"
      break;
    case 10:
      month = "نوفمبر"
      break;
    case 11:
      month = "ديسمبر"
      break;
  }
  switch (day) {
    case 0:
      day = "الأحد"
      break;
    case 1:
      day = "الإثنين"
      break;
    case 2:
      day = "الثلاثاء"
      break;
    case 3:
      day = "الأربعاء"
      break;
    case 4:
      day = "الخميس"
      break;
    case 5:
      day = "الجمعة"
      break;
    case 6:
      day = "السبت"
      break;
  }
  document.getElementById("date1").innerHTML = `${date.getDate()} ${month} ${date.getFullYear()}`;
  let hour = date.toLocaleTimeString().split(":")[0];
  let min = date.toLocaleTimeString().split(":")[1];
  let sec = date.toLocaleTimeString().split(":")[2];
  document.querySelector("#time-now b").innerHTML = `${hour}:${min}:<span class="seconds">${sec}</span>  ${day}`;
}
setInterval(function () {
  getTimeDate()
}, 1000);

//------------------------------------------------------------ 

function getLocation() {
  return new Promise(resolve=>{
    navigator.geolocation.getCurrentPosition((position)=>{
      if(position){
        resolve(position);
      } 
    });
  })
}

function getTimesPrayer(position) {
  let date = new Date();
  axios.get(`https://api.aladhan.com/v1/calendar/${date.getFullYear()}/${date.getMonth()+1}?latitude=${position.latitude}&longitude=${position.longitude}&method=5`)
  .then(function (response) {
    let timings = response.data.data[date.getDate()-1].timings;

    // prayer times
    let timeFajr = timings.Fajr.split(" ")[0];
    let timeSunrise = timings.Sunrise.split(" ")[0];
    let timeDhuhr = timings.Dhuhr.split(" ")[0];
    let timeAsr = timings.Asr.split(" ")[0];
    let timeMaghrib = timings.Maghrib.split(" ")[0];
    let timeIsha = timings.Isha.split(" ")[0];
    
    // Fajr times
    document.querySelector("#Fajr .time").innerHTML = timeFajr;
    // Sunrise times
    document.querySelector("#Sunrise .time").innerHTML = timeSunrise;
    
    // Dhuhr times
    if (timeDhuhr.split(":")[0]==="13") {
      document.querySelector("#Dhuhr .time").innerHTML = `01:${timeDhuhr.split(":")[1]}`;
    } else{
      document.querySelector("#Dhuhr .time").innerHTML = timeDhuhr;
    }

    // Asr times
    let timeAsr12 = Number(timeAsr.split(":")[0])-12;
    document.querySelector("#Asr .time").innerHTML = `0${timeAsr12}:${timeAsr.split(":")[1]}`;
    
    // Maghrib times
    let timeMaghrib12 = Number(timeMaghrib.split(":")[0])-12;
    document.querySelector("#Maghrib .time").innerHTML = `0${timeMaghrib12}:${timeMaghrib.split(":")[1]}`;
    
    // Isha times
    let timeIsha12 = Number(timeIsha.split(":")[0])-12;
    document.querySelector("#Isha .time").innerHTML = `0${timeIsha12}:${timeIsha.split(":")[1]}`;
  })
}

function getHigri(position) {
  let date = new Date();
  axios.get(`https://api.aladhan.com/v1/calendar/${date.getFullYear()}/${date.getMonth()+1}?latitude=${position.latitude}&longitude=${position.longitude}&method=5&adjustment=2`)
  .then(function (response) {
    let dateHigri = response.data.data[date.getDate()-1].date.hijri;
    document.getElementById("date2").innerHTML = `${dateHigri.day} ${dateHigri.month.ar} ${dateHigri.year}`;
  })
}

async function getLocationDescription(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ar`;
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.display_name; // العنوان النصي
  } catch (error) {
      console.error('Error fetching location:', error);
      return "الموقع غير موجود";
  }
}

getLocation()
  .then(function (position) {
    getTimesPrayer(position.coords);
    getHigri(position.coords);
    getLocationDescription(position.coords.latitude,position.coords.longitude)
    .then(locationDescription => {
      document.getElementById("location").innerHTML = locationDescription;
    });
  })


const dom=id=>document.getElementById(id);
const createDiv=()=>document.createElement('div');
let eventList = localStorage.getItem('eventList') ? JSON.parse(localStorage.getItem('eventList')) : [];
let count = 0;
let proposedDate = null;
const nameOfDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const openDialog=date=>{
  proposedDate = date;
  const eventForDay = eventList.find(e => e.date === proposedDate);
  const domDisplay=id=>dom(id).style.display = 'block';
  const dialogShow=()=>{
    dom('eventDetails').innerText = eventForDay.title ; 
    domDisplay('deleteDialog') ;
  }
  eventForDay? dialogShow(): domDisplay('eventDialog');
  domDisplay('dialogBackScreen');
}

const closeDialog=()=> {
  const domDisp=id=>dom(id).style.display = 'none';
  dom('titleOfEvent').classList.remove('inpValidation');
  domDisp('eventDialog') ;
  domDisp('deleteDialog') ;
  domDisp('dialogBackScreen') ;
  dom('titleOfEvent').value = '';
  proposedDate = null;
  loadCalender();
}

const loadCalender=()=> {
  const date = new Date();
  if (count !== 0) {
    date.setMonth(new Date().getMonth() + count);
  }
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const startingDayOfMonth = new Date(year, month, 1);
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const dateDescribe={day: 'numeric', month: 'numeric', year: 'numeric', weekday: 'long'};
  const dateString = startingDayOfMonth.toLocaleDateString('en-us', dateDescribe);
  const dayInWeek = nameOfDays.indexOf(dateString.split(', ')[0]);
 
  dom('nameOfMonth').innerText = date.toLocaleDateString('en-us',{month:'short'})+'-'+year
  dom('dispCalender').innerHTML = '';

  for(let i = 1; i <= dayInWeek + totalDaysInMonth; i++) {
    const fieldOfDays = createDiv();
    fieldOfDays.classList.add('dayField');
    const dateStr = `${month + 1}/${i - dayInWeek}/${year}`;
    if (i > dayInWeek) { 
      fieldOfDays.innerText = i - dayInWeek;
      const eventForDay = eventList.find(e => e.date === dateStr);
      if (i - dayInWeek === day && count === 0) {
        fieldOfDays.id = 'currentDay';
      }
      if (eventForDay) {
        const eventData = createDiv();
        eventData.classList.add('event');
        eventData.innerText = `▲`; 
        fieldOfDays.appendChild(eventData);
      }
      fieldOfDays.addEventListener('click', () => openDialog(dateStr));
    } else {
      fieldOfDays.classList.add('blankField');
    }
    dom('dispCalender').appendChild(fieldOfDays);    
  }
}

const controller=()=> {

  const domListener=(id,event,action)=>dom(id).addEventListener(event,action) 
    domListener('nextMonth','click',()=>{count++ ; loadCalender()})
    domListener('previousMonth','click',()=>{count-- ; loadCalender()})
    domListener('save','click',saveEvent)
    domListener('cancel','click',closeDialog)
    domListener('delete','click',deleteEvent)
    domListener('close','click',closeDialog)
  }

const saveEvent=()=> {
  const saveValidation=()=>{
    dom('titleOfEvent').classList.remove('inpValidation');
    eventList.push({
      date: proposedDate,
      title: dom('titleOfEvent').value,
    });
    localStorage.setItem('eventList', JSON.stringify(eventList));
    closeDialog();
  }

  dom('titleOfEvent').value ? saveValidation() : dom('titleOfEvent').classList.add('inpValidation');

}

const deleteEvent=()=> {
  eventList = eventList.filter(e => e.date !== proposedDate);
  localStorage.setItem('eventList', JSON.stringify(eventList));
  closeDialog();
}




controller();
loadCalender();

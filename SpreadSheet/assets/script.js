//===============      Глобальные настройки      =================//
//настройки ячейки column_text
var Cell ={
	width : "125px",
	height : "80px",
	max_width : "200px",
	max_height: "150px",
	min_width: "115px",
	min_height: "70px", 
	border: "none",
	padding: "0px",
	margin: "0px",
}

//localStorage.setItem('table_saves',"");
//localStorage.clear();

let cell_entries = Object.entries(Cell);
for(let i in cell_entries){
	let setting_string = "";
	if(cell_entries[i][0].includes('_')){
		for (var j = 0; j < cell_entries[i][0].length; j++) {
			if(cell_entries[i][0][j]=='_'){
				setting_string += "-";
			}else{
				setting_string += cell_entries[i][0][j];
			}
		}
		$('.column_text').css({setting_string:cell_entries[i][1]});
	} else {
		setting_string = cell_entries[i][0];
		$('.column_text').css({ setting_string : cell_entries[i][1] });
	}
}

//подсказки
var hints = [ 
	"Для добавления и удаления строк и столбцов используйте редактирующие панели",
	"Изменяйте размер ячейки зажав курсор в ее правом нижнем углу",
	"Периодически сохраняйте процесс работы. В противном случае, при перезагрузке, результат работы пропадет",
	"Добавляйте разную информацию в панель для ввода данных, чтобы легко манипултровать ей в процессе работы",
]
//максимум стобцов и строк
var maxColumns = 8;
var maxRows = 7;
//функция генерации случайного числаа
function getRandomInt(max) {return Math.floor(Math.random() * max);}
//функция загружающая контент из памяти
function loadTableContent(table_data = null){
	let saveTableInfo;
	saveTableInfo = table_data != null ? table_data : localStorage.getItem('tableSettings');
	saveTableInfo = saveTableInfo || "0={};1={};2={};3={};4={};5={};6={};7={};8={};9={};10={};11={};12={};13={};14={};15={};[4-4]";
	let tableSettings = saveTableInfo.split(';');
	let tableInfo = [];
	for (var i = 0; i < tableSettings.length; i++) {
		let ts = tableSettings[i].split('=');
		tableInfo.push(ts);
	}
	rws_n_clmns = tableSettings[tableSettings.length-1];
	tableInfo.pop();
	let rws_clmns = rws_n_clmns.slice(1, -1).split('-');
	let saveColumns = rws_clmns[1];
	let saveRows = rws_clmns[0];
	let column = document.querySelectorAll('.column');
	let row = document.querySelectorAll('.row');
	let cLength = column.length/row.length;
	let rLength = row.length;
	if(saveColumns>cLength){
		let j = saveColumns-cLength;
		while(j>0){addColumnFunc();j--;}
	}else{
		let j = cLength-saveColumns;
		while(j>0){removeColumnFunc();j--;}
	}
	if(saveRows>rLength){
		let j = saveRows-rLength;
		while(j>0){addRowFunc();j--;}
	}else{
		let j = rLength-saveRows;
		while(j>0){removeRowFunc();j--;}
	} 
	let column_text = document.querySelectorAll('.column_text');
	for (var i = 0; i < column_text.length; i++) {
		column_text[i].value = "";
	}
	for (var i = 0; i < tableInfo.length; i++) {
		let cellSettings = tableInfo[i][1];
		cellSettings = cellSettings.split(',');
		for (var j = 0; j < cellSettings.length-1; j++) {
			let cellInfo = cellSettings[j].split(':')
			if(column_text[i]!=undefined){
				if(cellInfo[0]=="w"){
					column_text[i].style.width = cellInfo[1]+"px";
				}
				if(cellInfo[0]=="h"){
					column_text[i].style.height = cellInfo[1]+"px";
				}
				if(cellInfo[0]=="t"){
					column_text[i].value = cellInfo[1];
				}
			}
		}
	}
	reloadTableSize();
}
//показ подсказок
let header_text = document.querySelector('.header_text');
header_text.innerHTML = hints[getRandomInt(hints.length)];
//сохраняющая кнопка
let save_table_info = document.querySelector('.state_save_button');
//действия, совершаемые при перезагрузке
var loadOnce = true;
if(loadOnce){
	save_table_info.classList.add('clicked');
	let saveColumns = localStorage.getItem('columns');
	let saveRows = localStorage.getItem('rows');
	if(saveColumns == null){ saveColumns = 4;}
	if(saveRows == null){ saveRows = 4;}
	let column = document.querySelectorAll('.column');
	let row = document.querySelectorAll('.row');
	let cLength = column.length/row.length;
	let rLength = row.length;
	//getHint().then(getHint());
	if(saveColumns>cLength){
		let j = saveColumns-cLength;
		while(j>0){addColumnFunc();j--;}
	}else{
		let j = cLength-saveColumns;
		while(j>0){removeColumnFunc();j--;}
	}
	if(saveRows>rLength){
		let j = saveRows-rLength;
		while(j>0){addRowFunc();j--;}
	}else{
		let j = rLength-saveRows;
		while(j>0){removeRowFunc();j--;}
	} 
	loadTableContent();
	if(localStorage.getItem('userInputData')!=null){
		let userInputData = localStorage.getItem('userInputData');
		userInputData = userInputData.split(';');
		let dataList = document.querySelector('.data_list');
		for (var i = 0; i < userInputData.length-1; i++) {
			dataList.innerHTML +='<div class="dis" draggable="true">'+userInputData[i]+'</div>';
		}
	}
	if(localStorage.getItem('table_saves') != null){
		let table_saves = localStorage.getItem('table_saves');
		let sub_str = "";
		for (var i = 0; i < table_saves.length; i++) {
			if(table_saves[i]==';' || i==table_saves.length){
				document.querySelector('.saving_progress').innerHTML += sub_str;
				sub_str = "";
			} else {
				sub_str += table_saves[i];
			}
		}
	}
	if(document.documentElement.clientWidth<1200){
		Cell.min_width = "80px"; 
	}
	reloadTableSize();
	reloadAndSaveData();
	loadOnce=false;
}

//while(true){
//	setTimeout(()=>{
//		header_text.innerHTML = hints[getRandomInt(hints.length)];
//	}, 1500)
//}

//кнопки управления
const addColumn = document.querySelector('.add_column')
const addRow = document.querySelector('.add_row')
const removeColumn = document.querySelector('.remove_column')
const removeRow = document.querySelector('.remove_row')
const selectAll = document.querySelector('.list_button.select_all')
const deleteAll = document.querySelector('.list_button.clear_all')
const deleteSelection = document.querySelector('.list_button.clear_selection')
const deleteSelected = document.querySelector('.list_button.clear_selected')

//===============   ^   Глобальные настройки   ^   =================//

//функция изменения размера таблицы
function reloadTableSize(){
	var columns = document.querySelectorAll('.column');
	var row = document.querySelectorAll('.row');
	row = row[row.length-1];
	row = row.querySelectorAll('.column_text');
	let tableWidth = 0; 
	for (var i = 0; i < row.length; i++) {
		if( row[i].style.width!=""){
			let numWidth = Number(row[i].style.width.slice(0, -2));
			tableWidth += numWidth;
		}	
		else { 
			let numWidth = Number(Cell.min_width.slice(0, -2)); 
			tableWidth += numWidth;
		}
	}
	let width = tableWidth+(row.length*5);
	$('.main_table_holder').css({'width':width+'px'});
	//$('.main_table_holder').css({'transform':'translate('+(width/100)+'%, 0%)'});
	//.main_table_holder{
	//	transform: translate(20%, 50%);
	//}
}
function saveTableContent(){
	var column_text = document.querySelectorAll('.column_text');
	let saveString = "";
	for (var i=0;i<column_text.length;i++){
		saveString +=i+"=";
		let elem = column_text[i];
		let cell_info = "";
		if(elem.clientWidth!=Cell.min_width.slice(0, -2)){cell_info += "w:"+elem.clientWidth+",";}
		if(elem.clientHeight!=Cell.min_height.slice(0, -2)){cell_info += "h:"+elem.clientHeight+",";};
		if(elem.closest('.column_text').value!=""){
			cell_info += "t:"+elem.closest('.column_text').value+",";
		};
		saveString+=cell_info;
		saveString+=";";
	}
	let column = document.querySelectorAll('.column');
	let row = document.querySelectorAll('.row');
	saveString += "["+row.length+"-"+(column.length/row.length)+"]";
	localStorage.setItem("tableSettings",saveString);
	let day = new Date().getDate();
	let month = new Date().getMonth()+1;
	let hours = new Date().getHours();
	let minutes = new Date().getMinutes();
	let secs = new Date().getSeconds();
	let table_code = day+"_"+month+"_"+hours+"_"+minutes+"_"+secs;
	let new_table_save = '<div class="table_save" name="'+table_code+'">табл_1'+day+"."+month+" в "+hours+":"+minutes+":"+secs +"</div>";
	document.querySelector('.saving_progress').innerHTML += new_table_save;
	if(localStorage.getItem('table_saves') != null){
		let table_saves = localStorage.getItem('table_saves');
		table_saves += new_table_save +";";
		localStorage.setItem('table_saves',table_saves);
	} else { localStorage.setItem('table_saves',new_table_save); }
	localStorage.setItem(table_code, saveString);
	
}

//функция перезаписи данных и контроля кнопок
function reloadAndSaveData(){
	const addColumn = document.querySelector('.add_column')
	const addRow = document.querySelector('.add_row')
	const removeColumn = document.querySelector('.remove_column')
	const removeRow = document.querySelector('.remove_row')
	var column = document.querySelectorAll('.column');
	var row = document.querySelectorAll('.row');
	for (var i = 0; i < column.length; i++) {
		column[i].querySelector('span').innerHTML = i+1;
	}
	if(row.length == 1){
		removeRow.style.pointerEvents = 'none';
		removeRow.style.color = '#999';
	}else{ 
		removeRow.style.pointerEvents = 'auto'; 
		removeRow.style.color = '#000';
	}
	if((column.length/row.length) == 1){
		removeColumn.style.pointerEvents = 'none';
		removeColumn.style.color = '#999';
	}else{ 
		removeColumn.style.pointerEvents = 'auto'; 
		removeColumn.style.color = '#000';
	}
	if(row.length == maxRows){
		addRow.style.pointerEvents = 'none';
		addRow.style.color = '#999';
	}else{ 
		addRow.style.pointerEvents = 'auto'; 
		addRow.style.color = '#000';
	}
	if((column.length/row.length) == maxColumns){
		addColumn.style.pointerEvents = 'none';
		addColumn.style.color = '#999';
	}else{ 
		addColumn.style.pointerEvents = 'auto'; 
		addColumn.style.color = '#000';
	}
	//обновление inputs
	inputCol = document.querySelector('.column_input').value = (column.length/row.length);
	inputRow = document.querySelector('.row_input').value = row.length;
	//сохранение данных в localStorage
	//сохраняем всю информацию по таблице (ширина-длина-текст ячеек)
	//if(!loadOnce){saveTableContent();loadTableContent();}
}

//функционал input'ов
stateInputs = document.querySelectorAll('.state_input');
for(let i=0;i<stateInputs.length;i++){
	stateInputs[i].addEventListener('keydown', function(e){
		if(e.key === 'Enter'){
		var column = document.querySelectorAll('.column');
		var row = document.querySelectorAll('.row');
		let saveRow = document.querySelectorAll('.row').length;
		let saveColumn = (document.querySelectorAll('.column').length)/saveRow;
			c = document.querySelector('.column_input');
			r = document.querySelector('.row_input');
			rValue = +r.value;
			if(c.value > maxColumns || c.value < 1 || (c.value.match(/^([а-яё][А-ЯЁ]+|[a-z][A-Z]+)$/i))){ 
				c.value = "";
				c.placeholder = "от 1 до "+maxColumns;
			}else{
				if(c.value>saveColumn){
					let j = c.value-saveColumn;
					while(j>0){addColumnFunc();j--;reloadTableSize();}
					saveColumn = c.value;
				}else{
					let j = saveColumn-c.value;
					while(j>0){removeColumnFunc();j--;}
					saveColumn = c.value;
				}
			}
			if(rValue > maxRows || rValue < 1 || (r.value.match(/^([а-яё][А-ЯЁ]+|[a-z][A-Z]+)$/i))){ 
				r.value = "";
				r.placeholder = "от 1 до "+maxRows;
			}else{
				if(rValue>saveRow){
					let j = rValue-saveRow;
					while(j>0){addRowFunc();j--;}
					saveRow = rValue;
				}else{
					let j = saveRow-rValue;
					while(j>0){removeRowFunc();j--;}
					saveRow = rValue;
				}
			}
			for (var i = 0; i < column.length; i++) {
				column[i].querySelector('span').innerHTML = i+1;
			}
		}
	});
}
dataInput = document.querySelector('.name_input');
dataList = document.querySelector('.data_list');
dataInput.addEventListener('keydown', function(e){
	if(e.key === 'Enter'){
		if(dataInput.value != ""){
			dataList.innerHTML += '<div class="dis" draggable="true">'+dataInput.value+'</div>';
		}
		let all_data_spans = document.querySelectorAll('.dis');
		let saveInputData = "";
		for (var i = 0; i < all_data_spans.length; i++) {
			saveInputData += all_data_spans[i].innerHTML+";";
		}
		localStorage.setItem('userInputData',saveInputData);
		dataInput.value = "";
	}
});
dataList.addEventListener('click',(event)=>{
	let single_dis = event.target.closest('.dis');
	if(event.shiftKey){
		let first_cell = document.querySelector('.selected');
		first_cell.classList.add('selected');
		single_dis.classList.add('selected');
		if(first_cell != undefined){
			let all_dis = document.querySelectorAll('.dis');
			all_dis = Array.prototype.slice.call(all_dis);
			let start, end;
			if(all_dis.indexOf(first_cell)>all_dis.indexOf(single_dis)){
				start = single_dis;
				end = first_cell;
			} else {
				start = first_cell;
				end = single_dis;
			}
			let lever;
			for (var i = 0; i < all_dis.length; i++) {
				if(all_dis[i]==start){ lever = true; }
				if(lever){
					if(all_dis[i]==end){
						lever = false;
					} else {
						all_dis[i].classList.add('selected');
					}
				} 
			}
		}
	} else {
		single_dis.classList.toggle('selected');
	}
});

dataList.addEventListener('mousedown', ()=>{
	let cells = document.querySelectorAll('.column_text');
	cells.forEach((cell)=>{
		let dis;
		dataList.addEventListener('dragstart',(event)=>{
			dis = event.target.closest('.dis').innerHTML;
		});
		cell.ondragover = (event)=>{event.preventDefault();}
		cell.ondragenter = ()=>{cell.classList.add('drag_hovered');}
		cell.ondragleave = ()=>{cell.classList.remove('drag_hovered');}
		cell.ondrop = (event)=>{
			save_table_info.classList.remove('clicked');
			cell.classList.remove('drag_hovered');
			if(cell.value!=""){ cell.value += '\n'+dis;
			} else {
				cell.value += dis;
			}
		}
	});
});
let load_table_save = document.querySelector('.saves_button.load_table_save');
let select_all_saves = document.querySelector('.saves_button.select_all_saves');
let clear_selection = document.querySelector('.saves_button.clear_selection');
let delete_selected_saves = document.querySelector('.saves_button.delete_selected_saves');
document.querySelector('.saving_progress_button').addEventListener('click',(event)=>{
	let control_save_buttons = document.querySelector('.control_saves_buttons');
	control_save_buttons.classList.toggle('hidden');
	let all_selected_saves = document.querySelectorAll('.table_save.selected');
	if(all_selected_saves.length==0 || all_selected_saves.length>1){
		load_table_save.classList.add('banned');
	} else {
		load_table_save.classList.remove('banned');
	}
});
document.querySelector('.saving_progress').addEventListener('click',(event)=>{
	let one_save = event.target.closest('.table_save');
	if(one_save.getAttribute('name') != null){
		one_save.classList.toggle('selected');
	}
	let all_selected_saves = document.querySelectorAll('.table_save.selected');
	if(all_selected_saves.length > 1){
		load_table_save.classList.add('banned');
	} else {
		load_table_save.classList.remove('banned');
	}
});
load_table_save.addEventListener('click', ()=>{
	let one_save = document.querySelector('.table_save.selected');
	let retrieved_save = localStorage.getItem(one_save.getAttribute('name'));
	one_save.classList.remove('selected');
	loadTableContent(retrieved_save);
	save_table_info.classList.remove('clicked');
	document.querySelector('.saving_progress_button').classList.remove('showing');
	document.querySelector('.saving_progress').classList.remove('showing');
	document.querySelector('.control_saves_buttons').classList.add('hidden')
});
select_all_saves.addEventListener('click',()=>{
	let all_saves = document.querySelectorAll('.table_save');
	for (var i = 0; i < all_saves.length; i++) {
		all_saves[i].classList.toggle('selected');
	}
});
clear_selection.addEventListener('click',()=>{
	let all_saves = document.querySelectorAll('.table_save');
	for (var i = 0; i < all_saves.length; i++) {
		all_saves[i].classList.remove('selected');
	}
});
delete_selected_saves.addEventListener('click',()=>{
	let all_saves = localStorage.getItem('table_saves');
	let selected_saves = document.querySelectorAll('.table_save.selected');
	let selected_saves_str = "";
	for (var i = 0; i < selected_saves.length; i++) {
		selected_saves_str += selected_saves[i].outerHTML.replace(' selected','')+";";
	}
	all_saves = all_saves.split(';');
	selected_saves_str = selected_saves_str.split(';');
	let table_saves = [];
	let deleted_saves = [];
	for (var i = 0; i < all_saves.length-1; i++) {
		if(selected_saves_str.indexOf(all_saves[i])==-1){
			table_saves.push(all_saves[i]);
		} else  {
			deleted_saves.push(all_saves[i]);
		}
	}
	for (var i = 0; i < deleted_saves.length; i++) {
		let save_name = "";
		for (var j = deleted_saves[i].indexOf('name')+6; j < deleted_saves[i].length; j++) {
			if(deleted_saves[i][j]=='"'){break;}
			save_name += deleted_saves[i][j];
		}
		localStorage.removeItem(save_name);
	}
	let table_saves_str = "";
	for (var i = 0; i < table_saves.length; i++) { table_saves_str += table_saves[i]+';'; }
	localStorage.setItem('table_saves',table_saves_str);
	
	document.querySelector('.saving_progress').innerHTML = "";
	if(table_saves != null){
		for (var i = 0; i < table_saves.length; i++) {
			document.querySelector('.saving_progress').innerHTML += table_saves[i];
		}
	}
});
let shiftPressed = false;
let point = [];
let fast = document.querySelector('.fast_selection');
function getFastSelectedCells(){
	point[2]=event.clientX;
	point[3]=event.clientY;
	if(shiftPressed){
		let diap = point[1]>point[3] ? [point[3],point[1]] : [point[1],point[3]];
		let diap2 = point[0]>point[2] ? [point[2],point[0]] : [point[0],point[2]];
		let t_hi = document.querySelector('.main_table_holder').offsetTop;
		let all_cells = document.querySelectorAll('.column');
		let needed_cells = [];
		for (var i = 0; i < all_cells.length; i++) {
			let cell_data = all_cells[i].getBoundingClientRect();
				//высота и низ больше начала
				//высота и низ меньше конца
			//(cell_data['top']>diap[0] && cell_data['bottom']>diap[0] && cell_data['top']<diap[1] && cell_data['bottom']<diap[1])
				//высота меньше начала
				//низ больше начала
				//высота меньше конца 
				//низ меньше конца
			//(cell_data['top']<diap[0] && cell_data['bottom']>diap[0] && cell_data['top']<diap[1] && cell_data['bottom']<diap[1])
				//высота больше начала
				//низ больше начала
				//высота меньше конца 
				//низ больше конца
			//(cell_data['top']>diap[0] && cell_data['bottom']>diap[0] && cell_data['top']<diap[1] && cell_data['bottom']>diap[1])
				//высота меньше начала
				//низ больше начала
				//высота меньше конца 
				//низ больше конца
			//(cell_data['top']<diap[0] && cell_data['bottom']>diap[0] && cell_data['top']<diap[1] && cell_data['bottom']>diap[1])
			if((cell_data['top']>diap[0] && cell_data['bottom']>diap[0] && cell_data['top']<diap[1] && cell_data['bottom']<diap[1]) 
				|| (cell_data['top']<diap[0] && cell_data['bottom']>diap[0] && cell_data['top']<diap[1] && cell_data['bottom']<diap[1])
				|| (cell_data['top']>diap[0] && cell_data['bottom']>diap[0] && cell_data['top']<diap[1] && cell_data['bottom']>diap[1])
				|| (cell_data['top']<diap[0] && cell_data['bottom']>diap[0] && cell_data['top']<diap[1] && cell_data['bottom']>diap[1])){
				needed_cells.push(all_cells[i]);
			} 
		}
		let all_needed_cells = []
		for (var i = 0; i < needed_cells.length; i++) {
			let cell_data = all_cells[i].getBoundingClientRect();
			if((cell_data['left']>diap2[0] && cell_data['right']>diap2[0] && cell_data['left']<diap2[1] && cell_data['right']<diap2[1]) 
				|| (cell_data['left']<diap2[0] && cell_data['right']>diap2[0] && cell_data['left']<diap2[1] && cell_data['right']<diap2[1])
				|| (cell_data['left']>diap2[0] && cell_data['right']>diap2[0] && cell_data['left']<diap2[1] && cell_data['right']>diap2[1])
				|| (cell_data['left']<diap2[0] && cell_data['right']>diap2[0] && cell_data['left']<diap2[1] && cell_data['right']>diap2[1])){
				all_needed_cells.push(needed_cells[i]);
			} 
		}
		return all_needed_cells;
	}
}
document.querySelector('body').addEventListener('mousedown',(event)=>{
	if (event.shiftKey){
		event.preventDefault();
		shiftPressed = true;
		fast.classList.add('action');
		document.querySelector('body').classList.add('no_selection');
		fast.style.left = event.clientX+'px';
		fast.style.top = event.clientY+'px';
		point[0] = event.clientX;
		point[1] = event.clientY;
	} else {
		let list_wrap = document.querySelector('.list_name_wrapper');
		if(!event['path'].includes(list_wrap)){
			let cells = document.querySelectorAll('.column');
			for (var i = 0; i < cells.length; i++) {
				cells[i].classList.remove('fast');
			}
		}
	}
});
document.querySelector('body').addEventListener('mousemove',(event)=>{
	if (event.shiftKey && shiftPressed){
		if(event.clientY < point[1] && event.clientX < point[0]){
			fast.style.height = (point[1] - event.clientY) +'px';
			fast.style.width = (point[0] - event.clientX) +'px';
			$('.fast_selection').css({'transform':'translate(-100%,-100%)'})
		} else if(event.clientY > point[1] && event.clientX < point[0]){
			fast.style.height = (event.clientY - point[1]) +'px';
			fast.style.width = (point[0]-event.clientX) +'px';
			$('.fast_selection').css({'transform':'translate(-100%,0%)'})
		} else if(event.clientY < point[1] && event.clientX > point[0]){
			fast.style.height = (point[1] - event.clientY) +'px';
			fast.style.width = (event.clientX - point[0]) +'px';
			$('.fast_selection').css({'transform':'translate(0%,-100%)'})
		} else if(event.clientY > point[1] && event.clientX > point[0]){
			fast.style.height = (event.clientY - point[1]) +'px';
			fast.style.width = (event.clientX - point[0]) +'px';
			$('.fast_selection').css({'transform':'translate(0%,0%)'})
		}
		let all_cells = document.querySelectorAll('.column');
		for (var i = 0; i < all_cells.length; i++) {
			all_cells[i].classList.remove('fast');
		}
		let fast_cells = getFastSelectedCells();
		for (var i = 0; i < fast_cells.length; i++) {
			fast_cells[i].classList.add('fast');
		}
	}
});
document.querySelector('body').addEventListener('mouseup',(event)=>{
	fast.classList.remove('action');
	document.querySelector('body').classList.remove('no_selection');
	fast.style.left = fast.style.top = fast.style.height = fast.style.width = '0px';
	point[2]=event.clientX;
	point[3]=event.clientY;
	if(shiftPressed){
		let fast_cells = getFastSelectedCells();
		for (var i = 0; i < fast_cells.length; i++) {
			fast_cells[i].classList.add('fast');
		}
		shiftPressed = false;
	}
});


//функция добавления столбца
function addColumnFunc(){
	let row = document.querySelectorAll('.row');
	let columns = document.querySelectorAll('.column');
	let colength = columns.length/row.length;
	let columns_text = document.querySelectorAll('.column_text');
	let text = [];
	//цикл, сохраняющий текст в таблице
	for (var i = 0; i < columns.length; i++) {
		if(columns_text[i].value != ""){
			let cell_text = columns_text[i].value;
			let koef = 0;
			let text_index = i+1;
			while( text_index>0 ){ 
				text_index-=colength
				if(text_index>0){ koef++; } 
			}
			text.push(i+koef);
			text.push(cell_text);
		}
	}
	//добавление новой ячейки
	for (var i = 0; i <= columns_text.length; i++) {
		if(i % colength == 0 && i!=0){
			columns[i-1].outerHTML += columns[i-1].outerHTML;
		}
	}
	row = document.querySelectorAll('.row');
	columns = document.querySelectorAll('.column');
	columns_text = document.querySelectorAll('.column_text');
	colength = columns.length/row.length;
	for (var i = 0; i <= columns_text.length ; i++) {
		if(i % colength == 0 && i!=0){
			columns_text[i-1].style.width= Cell.min_width;
		}
	}	
	//возврат текста в таблицы 
	columns_text = document.querySelectorAll('.column_text');
	for (var i = 0; i < text.length; i++) {
		if(columns_text[text[i*2]]!=undefined){
			columns_text[text[i*2]].value = text[(i*2)+1];
		}
	}
	reloadAndSaveData();
}

//функция добавления строки
function addRowFunc(){
	let table = document.querySelector('.main_table');
	var row = document.querySelectorAll('.row');
	let columns_text = document.querySelectorAll('.column_text');
	let colength = columns_text.length/row.length;
	let text = [];
	//цикл, сохраняющий текст в таблице
	for (var i = 0; i < columns_text.length; i++) {
		if(columns_text[i].value != ""){
			let cell_text = columns_text[i].value;
			text.push(i);
			text.push(cell_text);
		}
	}
	row = row[row.length-1];
	row.outerHTML += row.outerHTML;
	if(!loadOnce){
		row = document.querySelectorAll('.row');
		let added_row = row[row.length-1];
		let added_row_columns = added_row.querySelectorAll('.column');
		for (var i = 0; i < added_row_columns.length; i++) {
			added_row_columns[i].querySelector('.column_text').style.height = Cell.min_height;
		}
	}
	columns_text = document.querySelectorAll('.column_text');
	for (var i = 0; i < text.length; i++) {
		if(columns_text[text[i*2]]!=undefined){
			columns_text[text[i*2]].value = text[(i*2)+1];
		}
	}
	reloadAndSaveData();
}

//функция удаления строки
function removeRowFunc(){
	let row = document.querySelectorAll('.row');
	let last = row[row.length - 1];
    last.parentNode.removeChild(last);
	reloadTableSize()
	reloadAndSaveData();
}

//функция удаления столбца
function removeColumnFunc(){
	let row = document.querySelectorAll('.row');
	for (var i = row.length - 1; i >= 0; i--) {
		single_row = row[i].querySelectorAll('.column');
		let last = single_row[single_row.length - 1];
    	last.parentNode.removeChild(last);
	}
	reloadTableSize()
	reloadAndSaveData();
}

/*
Вызов функции через замыкания
function carry (callback, arglist){
   var thisObj = this;
   return (function (){
      callback.apply(thisObj, arglist)
   });
}
var applied = carry(addColumnFunc,1);
applied();*/


//отслеживание событий
addColumn.addEventListener('click', ()=>{
	save_table_info.classList.remove('clicked');
	addColumnFunc();
	reloadTableSize();
	reloadAndSaveData();
	cells = document.querySelectorAll('.column_text')
});
addRow.addEventListener('click', ()=>{
	save_table_info.classList.remove('clicked');
	addRowFunc();
	reloadTableSize();
	reloadAndSaveData();
	cells = document.querySelectorAll('.column_text')
});
removeRow.addEventListener('click', ()=>{
	save_table_info.classList.remove('clicked');
	removeRowFunc();
});
removeColumn.addEventListener('click', ()=>{
	save_table_info.classList.remove('clicked');
	removeColumnFunc();
});
selectAll.addEventListener('click', ()=>{
	let diss = document.querySelectorAll('.dis');
	for (var i = 0; i < diss.length; i++) {
		diss[i].classList.add('selected');
	}
});
deleteAll.addEventListener('click',()=>{
	dataList.innerHTML = "";
	localStorage.setItem('userInputData',"");
});
deleteSelection.addEventListener('click', ()=>{
	let diss = document.querySelectorAll('.dis');
	for (var i = 0; i < diss.length; i++) {
		diss[i].classList.remove('selected');
	}
});
deleteSelected.addEventListener('click', ()=>{
	let savedInputs = [];
	let diss = document.querySelectorAll('.dis');
	for (var i = 0; i < diss.length; i++) {
		if(diss[i].getAttribute('class') == 'dis'){
			savedInputs.push(diss[i]);
		}
	}
	dataList.innerHTML = "";
	let saveInputData = "";
	for (var i = 0; i < savedInputs.length; i++) {
		dataList.innerHTML += '<span class="dis">'+savedInputs[i].innerHTML+'</span>'
		saveInputData += savedInputs[i].innerHTML+";";
	}
	localStorage.setItem('userInputData',saveInputData);
});

function cellSizeController(target){
	//принимаем текущий объект
	let changed_cell = target;
	//задан индекс
	let column_index = 0;
	//все ячейки
	let all_column_text = document.querySelectorAll('.column_text');
	//количество строк
	let row_length = document.querySelectorAll('.row').length;
	//количество столбцов
	let column_length = document.querySelectorAll('.column').length/row_length;
	//определяем индекс стобца
	for (var i = 0; i < all_column_text.length; i++) {
		if(changed_cell==all_column_text[i]){ column_index = i; }
	}
	column_index = column_index%column_length;
	//получаем изменяемую ширину 
	let changed_cell_width = changed_cell.style.width.slice(0, -2);
	if(changed_cell_width>200){
		changed_cell_width = 200+"px";
	} else {
		changed_cell_width = changed_cell.style.width;
	}
	//получаем текущий ряд
	let certain_row = target.closest('.row');
	certain_row = certain_row.querySelectorAll('.column_text');
	//изменяем высоту в ряду
	for(let i=0; i<certain_row.length;i++){ 
		certain_row[i].style.height = changed_cell.style.height;
	}
	//изменяем ширину в столбце
	for (var i = 0; i < row_length; i++) {
		let coldex = Number(column_index)
		let a = i;
		a*=column_length;
		a+=column_index+1;
		let item = all_column_text[a-1];
		item.style.width = changed_cell_width;
	}
	reloadTableSize();
}
let targ, part1 = false,part2 = false;
document.querySelector('.main_table').addEventListener('mousedown',(event)=>{
	targ = event.target.closest('.column').querySelector('.column_text');
	part1 = true;
});
document.querySelector('.main_panel').addEventListener('mouseup',(event)=>{
	part2 = true;
if(part1 && part2){
	cellSizeController(targ);
	save_table_info.classList.remove('clicked');
	part1 = false;
	part2 = false;
} else {
	part1 = false;
	part2 = false;
}
});

save_table_info.addEventListener('click', function(e){
	save_table_info.classList.add('clicked');
	reloadAndSaveData();
	saveTableContent();
	var column = document.querySelectorAll('.column');
	var row = document.querySelectorAll('.row');
	localStorage.setItem('columns',(column.length/row.length));
	localStorage.setItem('rows',row.length);
});
let saving_progress_btn = document.querySelector('.saving_progress_button');
saving_progress_btn.addEventListener('click',()=>{
	saving_progress_btn.classList.toggle('showing');
	document.querySelector('.saving_progress').classList.toggle('showing');
});

let cogwheel = document.querySelector('.cogwheel');
cogwheel.addEventListener('click',()=>{
	cogwheel.classList.toggle('spinning');
	document.querySelector('.cogwheel_panel').classList.toggle('hidden');
});
document.querySelector('.cogwheel_save_setting').addEventListener('click',()=>{
	document.querySelector('.cogwheel_panel').classList.add('hidden');
	cogwheel.classList.remove('spinning');
});
let body = document.querySelector('body');

//посказки на панелях
//разброс данных по ячейкам, нумерация, редактирование
//выбор разных таблиц
//ссылки



var idMov,nMov,totMov,archivio,criterio,nonFlag=1,criterioMov='',orderMov='',campiFiltroMov=[];
var idIsu=[],nIsu,totIsu,criterioIsu='',orderIsu='',campiFiltroIsu=[];
var currentx=0,currenty=0;
var lastFieldControl=null;
var ricaricaMov=false;
var savePos=0;

/*
Private Sub CheckForUserHint()
    
    Dim AuxTXT As String
    Dim AuxBP
    
    AuxTXT = Trim(Form_associa1a1.lastSelText)
    AuxBP = "" & Me.BP
        
    If AuxTXT <> "" And AuxBP <> "" Then
        If MsgBox("Hai selezionato la stringa '" & AuxTXT & "'" & vbCrLf & "La vuoi associare con il BP: " & AuxBP, vbYesNo + vbQuestion) = vbYes Then
            CurrentDb.Execute "INSERT INTO hint (txt, bp) VALUES ('" & Replace(AuxTXT, "'", "''") & "','" & AuxBP & "')"
            MsgBox "Associazione effettuata. Verrà utilizzata nella prossima importazione di movimenti", vbInformation
        End If
    End If
    
    Form_associa1a1.lastSelText = ""

End Sub
*/

function selectedText(input) {
    
    if(document.selection) {
        return(document.selection.createRange().text);
        
    } else {
        var startPos = input.selectionStart;
        var endPos = input.selectionEnd;
        return(input.value.substring(startPos, endPos));
    }
    
}

function checkForUserHint(i) {
        
    var auxTxt = jQuery.trim(selectedText($('#txt_note')[0]));
    if (auxTxt == $('#txt_note').val()) {
        auxTxt = '';
    }
    
    var auxBP = $('#txt_bp_' + i).val();
    
    if (auxTxt) {
        if (confirm("Hai selezionato la stringa '" + auxTxt + "'\nLa vuoi associare con il BP " + auxBP + ' ?')) {
            execute("INSERT INTO hint (txt, bp) VALUES ('" + auxTxt.replace(/'/g,"\\'") + "','" + auxBP + "')", function() {
                alert('Associazione effettuata. Verra\' utilizzata nella prossima importazione di movimenti');
            })
        }
    }
    
}

function addField(def) {
    
    var idControllo = '';
    
    var marginy = 56;
    var marginx = 5;
    
    var dylabel = 11;
    var dxsep = 10;
    var dysep = 0;
    var defaultHeight = 23;
    var defaultWidth = 110;
    var defaultLabelFontSize = 10;
    var defaultFontSize = 14;
    
    
    var name = def['name']==undefined?'undefined':def['name'];    
    var label = def['label']==undefined?name.substring(0,1).toUpperCase()+name.substring(1).toLowerCase():def['label'];    
    var type = def['type']==undefined?'txt':def['type'];
    var value = def['value']==undefined?'':def['value'];
    var left = def['left']==undefined?currentx:def['left'];
    var top = def['top']==undefined?currenty:def['top'];
    var width = def['width']==undefined?defaultWidth:def['width'];
    var height = def['height']==undefined?defaultHeight:def['height'];
    var labelFontSize = def['labelFontSize']==undefined?defaultLabelFontSize:def['labelFontSize'];
    var fontSize = def['fontSize']==undefined?defaultFontSize:def['fontSize'];
    var fontBold = def['fontBold']==undefined?'font-weight:bold;':'font-weight:bold;';
    var color = def['color']==undefined?'':'color:' + def['color'] + ';';
    var bgcolor = def['bgcolor']==undefined?'':'background-color:' + def['bgcolor'] + ';';
    var classe =  def['classe']==undefined?'class="gdp" ':'class="' + def['classe'] + '" ';
    var nomecampo = 'fieldname="' + (def['fieldname']==undefined ? name : def['fieldname'] )  + '" ';
    var fieldtype =  def['fieldtype']==undefined?'txt':def['fieldtype'];
    var border = def['border']==undefined ? 'border:none;' : 'border:' + def['border'] + ';';
    
    switch(type) {
        case 'txt':
            if (label) $('<span id="lbl_' + name + '" style="font-size:' + labelFontSize + ';position:absolute;left:' + left + 'px;top:' + top + 'px">' + label + '</span>').appendTo('body');
            idControllo = 'txt_' + name;
            $('<input ' + classe + nomecampo + 'type="text" fieldtype="' + fieldtype + '" id="' + idControllo + '" name="' + name + '" style="' + bgcolor + 'font-size:' + fontSize + ';position:absolute;' + fontBold + border + 'left:' + left + 'px;top:' + (top+dylabel) + 'px;width:' + width + 'px;height:' + height + 'px;" value="' + value + '" />').appendTo('body');
        break;
        
        case 'area':
            if (label) $('<span id="lbl_' + name + '" style="font-size:' + labelFontSize + ';position:absolute;left:' + left + 'px;top:' + top + 'px">' + label + '</span>').appendTo('body');
            idControllo = 'txt_' + name;
            $('<textarea ' + classe + nomecampo + 'id="' + idControllo + '" fieldtype="' + fieldtype + '" name="' + name + '" style="' + bgcolor + 'font-size:' + fontSize + ';position:absolute;' + fontBold + border + 'left:' + left + 'px;top:' + (top+dylabel) + 'px;width:' + width + 'px;height:' + height + 'px;">' + value + '</textarea>').appendTo('body');
        break;
        
        case 'button':
            idControllo = 'cmd_' + name;
            $('<button ' + classe + 'id="' + idControllo + '" style="' + bgcolor + 'font-size:' + fontSize + ';position:absolute;' + fontBold + 'top:' + (top+dylabel) + 'px;left:' + left + 'px;width:' + width + 'px;height:' + height + 'px;">' + label + '</button>').appendTo('body');
            if (def['click']) {
                $('#cmd_' + name).bind('mouseup',def['click']);
            }
        break;
        
        case 'label':
            idControllo = 'txt_' + name;
            $('<input ' + classe + 'type="text" id="' + idControllo + '" name="' + name + '" fieldtype="' + fieldtype + '" readonly="true" style="' + fontBold + bgcolor + 'font-size:' + fontSize + ';border:0px;position:absolute;' + border + 'left:' + left + 'px;top:' + (top+dylabel) + 'px;width:' + width + 'px;height:' + height + 'px;" value="' + value + '" />').appendTo('body');
        break;
        
        case 'check':
            idControllo = 'chk_' + name;
            $('<input ' + classe + nomecampo + 'type="checkbox" fieldtype="' + fieldtype + '" id="' + idControllo + '" name="' + name + '" style="' + bgcolor + 'border:0px;position:absolute;' + border + 'left:' + left + 'px;top:' + top + 'px;" value="' + value + '" />').appendTo('body');
            if (label) $('<label id="lbl_' + name + '" for="' + idControllo + '" style="font-size:' + labelFontSize + ';position:absolute;' + fontBold + 'left:' + (left + 22) + 'px;top:' + (top + 3) + 'px">' + label + '</label>').appendTo('body');
            
        break;
        
        case 'box':
            idControllo = 'box_' + name;
            $('<div ' + classe + 'id="' + idControllo + '" style="' + bgcolor + 'font-size:' + fontSize + ';position:absolute;' + border + 'top:' + (top+dylabel) + 'px;left:' + left + 'px;width:' + width + 'px;height:' + height + 'px;"></div>').appendTo('body');
        break;
        
        case 'filler':
        
        break;
        
        case 'return':
            currentx = marginx;            
            currenty = top + height + dysep + dylabel;
            return;
        break;
    }
    
    if (def['click']) {
        $('#' + idControllo).bind('click',def['click']);
    }

    if (def['mouseup']) {
        $('#' + idControllo).bind('mouseup',def['mouseup']);
    }

    if (def['keyup']) {
        $('#' + idControllo).bind('keyup',def['keyup']);
    }
    
    currentx = left + width + dxsep;
    currenty = top;
    
}

function query(sql,callback) {
    
    $.getJSON(
        "getsql.php",
        {sql: escape(sql)},        
        callback
    );
}

function execute(sql,callback) {
    
    $.ajax({
      url: "getsql.php",
      data: {sql: escape(sql)},
      complete: callback
    });    
    
}

function refreshMovNavigator() {
    
    if (nonFlag == 1) {
        var auxFiltro = ' [non flag.]';
    } else {
        var auxFiltro = '';
    }

    $('#txt_movCount').val('arc. ' + archivio + ' mov ' + (nMov+1) + ' di ' + totMov + auxFiltro);

}

function loadMov() {
    
    var auxCrit = '';
    
    if (ricaricaMov) {
        nMov=savePos;
        ricaricaMov=false;
    }
    
    $('#txt_movCount').val('Attendere...');

    if (nonFlag == 1) {
        auxCrit += " AND NOT (associato OR correntisti OR sportello OR altro OR `Non trovato` OR blocco<>0 OR (note2 is not null AND note2<>''))";
    }
    
    if (criterioMov) {
        auxCrit += ' AND ' + criterioMov;
    }
    
        
    var sql;
    sql =  "movimento,Azienda,Abi,Banca,Rbn,`Nro cc`,DATE_FORMAT(`Data operazione`,'%d-%m-%Y') as `Data operazione`,Importo,Segno,Divisa,";
    sql += "DATE_FORMAT(`Data Valuta`,'%d-%m-%Y') as `Data Valuta`,`Causale Abi`,`Descrizione Abi`,Note,Associato,Correntisti,Sportello,";
    sql += "Altro,`Non trovato`,NOTE2,hBP,hContoContr,hNContr,hNFatt,hFatture,pri,dataIns,dataBlocco,blocco,associatoBO";    
    sql = 'SELECT ' + sql + ' FROM MOVIMENTI ' + criterio + auxCrit + orderMov + ' LIMIT ' + nMov + ',1';
    
    //alert(sql);
    
    query(sql,function(data){
        //alert(data['NOTE2']);
        
        $('.movfield').val('');
        
        for(k in data[0]) {
            $('#txt_' + k.toLowerCase().replace(' ','_')).val(data[0][k]==null?'':data[0][k]);
            $('#chk_' + k.toLowerCase().replace(' ','_')).attr('checked',data[0][k] == 0?'':'checked');
        }
        
        if (data.length) {
            idMov = data[0]['movimento'];
        } else {
            idMov = -1;
        }
        
        refreshMovNavigator();
        
    });

    if (totMov==-1) {
        query("Select count(*) as n FROM movimenti " + criterio + auxCrit, function(data){
            totMov = data['n'];                        
            refreshMovNavigator();
        });        
    }
    
    showFilteredFields();
}

function refreshIsuNavigator() {

    $('#txt_isuCount').val((nIsu+1) + ' di ' + (totIsu==-1?'...':totIsu) + ' ' + criterioIsu + ' ' + orderIsu);

}

function showFilteredFields() {
  
    $('.isufield').css('border','0px');
    $.each(campiFiltroIsu,function(i, elem){
        $('#' + elem + '_0').css('border','2px solid orange');
        $('#' + elem + '_1').css('border','2px solid orange');
        $('#' + elem + '_2').css('border','2px solid orange');
        $('#' + elem + '_3').css('border','2px solid orange');
        $('#' + elem + '_4').css('border','2px solid orange');
    });
    
    $('.movfield').css('border','0px');
    $.each(campiFiltroMov,function(i, elem){
        $('#' + elem).css('border','2px solid orange');
    });
    

}

function loadIsu() {
    
    $('#txt_isuCount').val('Attendere...');
    
    var sql='';
        
    sql += "CONTATORE,NDOC,RIFERIMENTO,SOCIETA,BP,`CONTO CONTR`,`PARTITA IVA`,INTESTAZIONE,CONTRATTO,"
    sql += "DATE_FORMAT(`DATA DOC`,'%d-%m-%Y') as `DATA DOC`,DATE_FORMAT(`DATA REG`,'%d-%m-%Y') as `DATA REG`,"
    sql += "DATE_FORMAT(SCADENZA,'%d-%m-%Y') as SCADENZA,TESTO,IMPORTO,SEGNO,TD, `DOC SOST`,MOVIMENTO,ACCONTO,"
    sql += "`BLOCCO SOLL`,`UFFICIO INCASSI`,DATE_FORMAT(DATAALDO,'%d-%m-%Y') as DATAALDO,CLASSECONTO,CEDUTO,SERVIZIO"    
    
    var auxCrit = criterioIsu ? 'WHERE ' + criterioIsu : '';
    
    query('SELECT ' + sql + ' FROM isu ' + auxCrit + ' ' + orderIsu + ' LIMIT ' + nIsu + ',5',function(data){
        
        $('.isufield').val('');
        
        for(var i=0;i<5;i++) {
            if (r = data[i]) {
                for(k in r) {
                    $('#txt_' + k.toLowerCase().replace(' ','_') + '_' + i).val(r[k]==null?'':r[k]);
                }        
                idIsu[i]=r['CONTATORE'];
            }
        }
        
        refreshIsuNavigator();
        
    });

    if (totIsu == -1) {
        query("Select count(*) as n FROM isu " + auxCrit, function(data){
            totIsu = data['n'];
            refreshIsuNavigator();
        });
    }
    
    showFilteredFields();
    
}

function filtraISU() {
    
    var AuxBP = $('#txt_hbp').val();
    var AuxCC = $('#txt_hcontocontr').val();
    var AuxNContr = $('#txt_hncontr').val();
    
    var filtro = '';
    if (AuxBP) filtro += "BP='" + AuxBP + "' AND "
    if (AuxCC) filtro += "`CONTO CONTR`='" + AuxCC + "' AND "
    if (AuxNContr) filtro += "CONTRATTO='" + AuxNContr + "' AND "

    if (filtro) {
        criterioIsu = filtro.substr(0,filtro.length-5);
        nIsu=0;
        totIsu=-1;
        loadIsu();
    }

}

function cercaISU(searchSql) {    
    
    var sql = "SELECT nriga FROM (SELECT @rownum:=@rownum+1 nriga, isu.* from isu, (SELECT @rownum:=0) r "; 
    if (criterioIsu) sql += " WHERE " + criterioIsu;
    sql += ' ' + orderIsu;
    sql += ") aux WHERE " + searchSql + " AND nriga > " + (nIsu + 1) + " LIMIT 1";

    query(sql, function(data) {
        if (data && data['nriga'] && parseInt(data['nriga'],10) != -1) {
            nIsu = parseInt(data['nriga'],10) - 1;
            loadIsu();
            
        } else {
            alert("Nessun record corrisponde al criterio inserito");
            
        }
    });
    
}

function createISUform(i,y) {
    
    
    addField({name: 'container_' + i, type: 'box', border: '1px solid black', left: 0, top: y-12, width: 1010, height: 108, bgcolor: i%2==0?'#CCFFCC':'#D8E8D8'});
    
    addField({classe: 'isufield', label: 'Intestazione', name: 'intestazione_'+i, fieldname: 'INTESTAZIONE', value: 'DEMOCRATICI DI SINISTRA FEDERAZIONE PROV', fontSize: 10, left: 10, top: y, width: 345});
    addField({classe: 'isufield', label: 'Soc', name: 'societa_'+i, fieldname: 'SOCIETA', value: '', width: 45, keyup: function(event) {
        if (event.keyCode == '13') {
            event.preventDefault();
            sql = "UPDATE isu SET SOCIETA='" + this.value.replace(/,/g,".") + "' WHERE CONTATORE=" + idIsu[i];
            $(this).css({backgroundColor: 'red' });
            execute(sql,function (){                
                $('#txt_societa_'+i).css({backgroundColor: '#F1F298' });
            });           
        }        
    }});
    
    
    
    addField({classe: 'isufield', label: 'N doc', name: 'ndoc_'+i, fieldname: 'NDOC', value: '', width: 110, keyup: function(event) {
        if (event.keyCode == '13') {
            event.preventDefault();
            sql = "UPDATE isu SET NDOC='" + this.value.replace(/,/g,".") + "' WHERE CONTATORE=" + idIsu[i];
            $(this).css({backgroundColor: 'red' });
            execute(sql,function (){                
                $('#txt_ndoc_'+i).css({backgroundColor: '#F1F298' });
            });           
        }        
    }});
    
    addField({classe: 'isufield', label: 'Riferimento', name: 'riferimento_'+i, fieldname: 'RIFERIMENTO', value: '', width: 140, keyup: function(event) {
        if (event.keyCode == '13') {
            event.preventDefault();
            sql = "UPDATE isu SET RIFERIMENTO='" + this.value.replace(/,/g,".") + "' WHERE CONTATORE=" + idIsu[i];
            $(this).css({backgroundColor: 'red' });
            execute(sql,function (){                
                $('#txt_riferimento_'+i).css({backgroundColor: '#F1F298' });
            });           
        }        
    }});
    
    
    
    
    addField({classe: 'isufield', label: 'Data Doc', name: 'data_doc_'+i, fieldname: 'DATA DOC', value: '', fieldtype: 'date', width: 85});
    addField({classe: 'isufield', label: 'Data Reg', name: 'data_reg_'+i, fieldname: 'DATA REG', value: '', fieldtype: 'date', width: 85});
    addField({classe: 'isufield', label: 'Scadenza', name: 'scadenza_'+i, fieldname: 'SCADENZA', value: '', fieldtype: 'date', width: 85});
    addField({classe: 'isufield', label: 'TD', name: 'td_'+i, fieldname: 'TD', value: '', width: 30});    
    addField({type: 'return'});
    
    addField({classe: 'isufield', label: 'Testo', name: 'testo_'+i, fieldname: 'TESTO', value: '', fontSize: 10, left: 10, width: 345});    
    addField({classe: 'isufield', label: 'P. IVA', name: 'partita_iva_'+i, fieldname: 'PARTITA IVA', value: 'LZZRLB43P47Z315A', width: 160});
    addField({classe: 'isufield', label: 'BP', name: 'bp_'+i, fieldname: 'BP', value: '1000210113', width: 110, keyup: function(event) {
        if (event.keyCode == '13') {
            event.preventDefault();
            sql = "UPDATE isu SET BP='" + this.value.replace(/,/g,".") + "' WHERE CONTATORE=" + idIsu[i];
            $(this).css({backgroundColor: 'red' });
            execute(sql,function (){                
                $('#txt_bp_'+i).css({backgroundColor: '#F1F298' });
            });           
        }        
    }});
    
    addField({classe: 'isufield', label: 'Conto contr.', name: 'conto_contr_'+i, fieldname: 'CONTO CONTR', value: '295000001028', width: 110});
    addField({classe: 'isufield', label: 'Contratto', name: 'contratto_'+i, fieldname: 'CONTRATTO', value: '3007278555', width: 110});
    addField({classe: 'isufield', label: 'Doc Sost', name: 'doc_sost_'+i, fieldname: 'DOC SOST', value: '', width: 110});
    
    addField({type: 'return'});
    
    
    
    addField({classe: 'isufield', label: 'BL', name: 'blocco_soll_'+i, fieldname: 'BLOCCO SOLL', value: '', left: 10, width: 20});
    addField({classe: 'isufield', label: 'Uff. Incassi', name: 'ufficio_incassi_'+i, fieldname: 'UFFICIO INCASSI', value: '', width: 95});
    addField({classe: 'isufield', label: 'C.Conto', name: 'classeconto_'+i, fieldname: 'CLASSECONTO', value: '', width: 46});
    addField({classe: 'isufield', label: 'Serv.', name: 'servizio_'+i, fieldname: 'SERVIZIO', value: '', width: 25});
    addField({classe: 'isufield', label: 'Ceduto', name: 'ceduto_'+i, fieldname: 'CEDUTO', value: '', width: 20});
    
    addField({classe: 'isufield', label: '', name: 'dataaldo_'+i, fieldname: 'DATAALDO', value: '', fieldtype: 'date', width: 90});
    addField({classe: 'isufield', label: '', name: 'movimento_'+i, fieldname: 'MOVIMENTO', value: '', fieldtype: 'num', width: 90});

    addField({classe: 'isufield', label: 'Importo', name: 'importo_'+i, fieldname: 'IMPORTO', fontBold: true, value: '', fieldtype: 'num', width: 110});
    addField({classe: 'isufield', label: 'Acconto', name: 'acconto_'+i, fieldname: 'ACCONTO', value: '', fieldtype: 'num', width: 110, keyup: function(event) {
        if (event.keyCode == '13') {
            event.preventDefault();
            sql = "UPDATE isu SET acconto='" + this.value.replace(/,/g,".") + "' WHERE CONTATORE=" + idIsu[i];
            $(this).css({backgroundColor: 'red' });
            execute(sql,function (){                
                $('#txt_acconto_'+i).css({backgroundColor: '#F1F298' });
            });           
        }        
    }});
    

    
    addField({label: 'Associa', bgcolor: '', type: 'button', name: 'associa_'+i, value: '', left: 715, width: 90, mouseup: function(){
    
        var sql;
        
        checkForUserHint(i);
        
        sql = "UPDATE isu SET MOVIMENTO= " + idMov + ", DATAALDO='" + getDataOperazione() + "' WHERE contatore = " + idIsu[i];
        $('#txt_dataaldo_'+i).css({backgroundColor: 'red' });
        $('#txt_movimento_'+i).css({backgroundColor: 'red' });
        execute(sql,function (){                            
            $('#txt_dataaldo_'+i).css({backgroundColor: '#F1F298' });
            $('#txt_movimento_'+i).css({backgroundColor: '#F1F298' });
            $('#txt_dataaldo_'+i).val($('#txt_data_operazione').val());
            $('#txt_movimento_'+i).val(idMov);
        });           
        
        $('#chk_associato').css({backgroundColor: 'red' });
        sql = "UPDATE movimenti SET associato=-1 WHERE movimento = " + idMov;
        execute(sql,function (){
            $('#chk_associato').css({backgroundColor: '#F1F298'});
            $('#chk_associato').attr('checked','checked');
        });           
        
        postAssocia();
        
    }});
    
    
    addField({label: 'Togli Ass.', type: 'button', name: 'togliassocia_'+i, value: '', width: 90, mouseup: function(){
    
        var sql;
        
        sql = "UPDATE isu SET MOVIMENTO=0, DATAALDO=NULL WHERE contatore = " + idIsu[i];
        $('#txt_dataaldo_'+i).css({backgroundColor: 'red' });
        $('#txt_movimento_'+i).css({backgroundColor: 'red' });
        execute(sql,function (){                            
            $('#txt_dataaldo_'+i).css({backgroundColor: '#F1F298' });
            $('#txt_movimento_'+i).css({backgroundColor: '#F1F298' });
            $('#txt_dataaldo_'+i).val('');
            $('#txt_movimento_'+i).val('0');
        });           
        
    }});

    addField({label: 'Dup.', type: 'button', name: 'duplica_'+i, value: '', width: 40, mouseup: function(){
        
        if (!confirm("Duplicare il record?")) {
            return;
        }
        
        sql = "INSERT INTO isu (`NDOC`,`RIFERIMENTO`,`SOCIETA`,`BP`,`CONTO CONTR`,`PARTITA IVA`,`INTESTAZIONE`,`CONTRATTO`,`DATA DOC`,`DATA REG`,`SCADENZA`,`TESTO`,`IMPORTO`,`SEGNO`,`TD`,`DOC SOST`,`MOVIMENTO`,`ACCONTO`,`BLOCCO SOLL`,`UFFICIO INCASSI`,`DATAALDO`,`CLASSECONTO`,`CEDUTO`,`SERVIZIO`) SELECT `NDOC`, `RIFERIMENTO`, `SOCIETA`, `BP`, `CONTO CONTR`, `PARTITA IVA`, `INTESTAZIONE`, `CONTRATTO`, `DATA DOC`, `DATA REG`, `SCADENZA`, `TESTO`, `IMPORTO`, `SEGNO`, `TD`, `DOC SOST`, `MOVIMENTO`, `ACCONTO`, `BLOCCO SOLL`, `UFFICIO INCASSI`, `DATAALDO`, `CLASSECONTO`, `CEDUTO`, `SERVIZIO` FROM isu WHERE contatore = " + idIsu[i];
        execute(sql,function(data){
            if (criterioIsu=='') {
                criterioIsu = '(CONTATORE=' + data.responseText + ')';
                totIsu = 1;
                nIsu = 0;
                
            } else {
                criterioIsu = '((' + criterioIsu + ') OR (CONTATORE=' + data.responseText + '))';
                if (totIsu != -1) {
                    totIsu = parseInt(totIsu) + 1;
                    nIsu = totIsu - 1;
                }
                
            }
            
            loadIsu();
        });
        
    }});
    
    
    addField({label: 'Elim.', type: 'button', name: 'elimina_'+i, value: '', width: 40, mouseup: function(){
        
        if (!confirm("Eliminare il record?")) {
            return;
        }
        
        sql = "DELETE FROM isu WHERE contatore = " + idIsu[i];
        execute(sql,function (){                            
            totIsu = totIsu - 1;
            if (totIsu==0) {
                criterioIsu='';
                totIsu=-1;
            } else {
                if (nIsu > totIsu - 5) {
                    nIsu = totIsu - 5;
                }            
            }
            loadIsu();            
        });           
        
    }});

    
}

RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

var operators = ['<=','>=','<>','LIKE','BETWEEN','=','<','>'];
var keywords = _(operators).union(['AND','OR','NOT']);

function separaTokens(txt) {
    
    
    var ricerca;
    var j;
        
    for(j=0; j<keywords.length; j++) {
        if (keywords[j].length==1) {
            ricerca = new RegExp(RegExp.escape(keywords[j] + '[^=>]'), "gi");
        } else {
            ricerca = new RegExp(RegExp.escape(keywords[j]), "gi");
        }
        
        txt = txt.replace(ricerca , ' ' + keywords[j] + ' ');
    }
    return(txt);
    
}

function formatValue(valore, tipo) {
    
    var formattato;

    switch (tipo) {        
        case 'date':
            if (valore.length==10) {
                formattato =  "'" + valore.substr(6,4) + '-' + valore.substr(3,2) + '-' + valore.substr(0,2) + "'";
            } else if (valore.length==8) {
                formattato =  "'" + valore.substr(4,4) + '-' + valore.substr(2,2) + '-' + valore.substr(0,2) + "'";
            } else if (valore.length==6) {
                formattato =  "'20" + valore.substr(4,2) + '-' + valore.substr(2,2) + '-' + valore.substr(0,2) + "'";
            } else if (valore.length==4) {
                formattato =  "'" + (new Date()).getFullYear() + '-' + valore.substr(2,2) + '-' + valore.substr(0,2) + "'";                        
            } else if (valore.length==5) {
                formattato =  "'" + (new Date()).getFullYear() + '-' + valore.substr(3,2) + '-' + valore.substr(0,2) + "'";            
            } else {
                formattato =  "'" + valore + "'";
            }
            
        break;
        
        case 'num':
            formattato = valore.replace(/,/g,".");
        break;
        
        case 'txt':
            if ((valore.substr(0,1) == '"' && valore.substr(-1,1) == '"') || (valore.substr(0,1) == "'" && valore.substr(-1,1) == "'")) {
                formattato = valore;
            } else {
                formattato = '"' + valore.replace(/\"/g,'\\"') + '"';
            }
        break;
        
        
    }
    
    return(formattato);
    
}

function filter2SQL(fieldName, fieldType, txt) {
    
    // questi rimangono inalterati e non sono considerati come valori
    
    var ricerca = [];
    var tokens = [];
    var lastStart=0;
    var dentroStringa='';
    var cc;
    var i;
    var j;
    var ret;
    
    
    
    for (i=0;i<txt.length;i++) {
        cc = txt.charAt(i);
        
        // fine di una stringa
        if (dentroStringa == cc) {
            dentroStringa = '';            
            tokens.push(['stringa',txt.substr(lastStart,i-lastStart+1)]);
            lastStart = i + 1;
            continue;
        }
        
        // inizio di una stringa
        if (cc == '"' || cc == "'") {
            dentroStringa = cc;
            tokens.push(['altro',txt.substr(lastStart,i-lastStart)]);
            lastStart = i;
            continue;
        }
        
    }
    if (dentroStringa!='') {
        //errore
        return('errore: stringa non terminata');    
    }
    tokens.push(['altro',txt.substr(lastStart)]);
    
    ret = '';
    for(i=0;i<tokens.length;i++) {
        ret += ' ' + ( tokens[i][0]=='altro' ? separaTokens(tokens[i][1]) : tokens[i][1] );
    }    
    
    // ora ho la stringa con gli spazi a posto, faccio lo split 
    // e tolgo gli elementi vuoti
    var ret2 = [];
    var aux = _(ret.split(' ')).without('');
    if (aux.length==1) {               
        //aux.unshift(); non funziona in IE
        
        if (fieldType=='txt' && aux[0].search("%") >= 0) {
            aux=['LIKE',aux[0]];
        } else {
            aux=['=',aux[0]];
        }
        
    }
    _(aux).each(function(word){
        if (_(operators).include(word)) {
            ret2.push('`' + fieldName + '`');
            ret2.push(word);
            
        } else if (_(keywords).include(word)) {
            ret2.push(word);
            
        } else {
            // se non e' una keyword allora suppongo sia un valore        
            ret2.push(formatValue(word,fieldType));
            
        }
    });
    
    return(ret2.join(' '));
    
}



function AskFieldCriteria(field, keepPrevious) {
    
    var criterio='';
    
    if (!field) return('');
    
    var nomeTabella = (field.className == 'movfield' ? 'movimenti' : 'isu');    
    var filtroEsistente = (field.className == 'movfield' ? criterioMov : criterioIsu);
    var nomeCampo = $(field).attr('fieldname');    
    var valoreCampo = field.value;
    var tipoCampo = $(field).attr('fieldtype');
    
    var msg = keepPrevious?"AGGIUNGI FILTRO":"NUOVO FILTRO";
    msg += " - Tabella " + nomeTabella + ", filtra per il campo " + nomeCampo + "\nN.B. usa % per jolly";
    var valore = prompt(msg,valoreCampo);
    if (valore != null) {
        criterio = filter2SQL(nomeCampo,tipoCampo,valore);
        if (criterio.substr(0,6) == 'errore') {
            alert(criterio);            
            return('');
        }
        
        if (keepPrevious && filtroEsistente) {            
            if (criterio) {
                criterio = filtroEsistente + ' AND ' + criterio;
                
                if (field.className == 'movfield') {
                    campiFiltroMov.push(field.id);
                } else {
                    campiFiltroIsu.push(field.id.substr(0,field.id.length-2));
                }                
                
            }
        } else {
            
            if (field.className == 'movfield') {
                campiFiltroMov=[field.id];
            } else {
                campiFiltroIsu=[field.id.substr(0,field.id.length-2)];
            }
            
        }
        
        return(criterio);
        
    } else {    
    
        return(null);
        
    }
    
}

function doFilter(keepPrevious) {
    
    if (!lastFieldControl) return;
    
    var crit = AskFieldCriteria(lastFieldControl,!!keepPrevious);
    if (crit == null) return;
    
    switch(lastFieldControl.className) {
        case 'movfield':
            
            criterioMov = crit;
            
            nMov = 0;
            totMov = -1;
            loadMov();
        break;
        
        case 'isufield':            
            criterioIsu = crit;
            
            nIsu=0;
            totIsu=-1;
            loadIsu();
        break;
    }
    

}

function AskSearchCriteria(field) {
    
    var criterio='';
    
    if (!field) return('');
    
    var nomeTabella = (field.className == 'movfield' ? 'movimenti' : 'isu');    
    var nomeCampo = $(field).attr('fieldname');
    var valoreCampo = field.value;
    var tipoCampo = $(field).attr('fieldtype');

    var msg = "Tabella " + nomeTabella + ", cerca per il campo " + nomeCampo + "\nN.B. usa % per jolly";
    var valore = prompt(msg,valoreCampo);
    if (valore != null) {
        
        if (valore != '') {
            
            criterio = "`" + nomeCampo + "` ";
            valore = valore.replace(/'/g,"\\'");
        
            switch (tipoCampo) {
                case 'txt':
                    criterio += "LIKE '" + valore + "'";
                break;
                
                case 'date':
                    if (valore.length==10) {
                        criterio += "= '" + valore.substr(6,4) + '-' + valore.substr(3,2) + '-' + valore.substr(0,2) + "'";
                    } else if (valore.length==8) {
                        criterio += "= '" + valore.substr(4,4) + '-' + valore.substr(2,2) + '-' + valore.substr(0,2) + "'";
                    } else if (valore.length==6) {
                        criterio += "= '20" + valore.substr(4,2) + '-' + valore.substr(2,2) + '-' + valore.substr(0,2) + "'";
                    } else if (valore.length==4) {
                        criterio += "= '" + (new Date()).getFullYear() + '-' + valore.substr(2,2) + '-' + valore.substr(0,2) + "'";                        
                    } else {
                        criterio += "= '" + valore + "'";
                    }
                    
                break;
                
                case 'num':
                    criterio += "= " + valore.replace(/,/g,".");
                break;
                
                default:
                    criterio += "LIKE '" + valore + "'";
                break;
            }
            
            
        } else {
        
            criterio = "";
        }
        
        return(criterio);
        
    } else {    
    
        return(null);
        
    }
    
}

function doSearch() {
    
    if (!lastFieldControl) return;
    
    var crit = AskSearchCriteria(lastFieldControl);
    if (crit == null) return;
    
    switch(lastFieldControl.className) {
        case 'movfield':

        break;
        
        case 'isufield':            
            cercaISU(crit);
            
        break;
    }
    
}

function removeFilter(tipo, keepPrevious) {
    
    if (tipo=='mov') {
        
        if (keepPrevious) {
            criterioMov = criterioMov.substr(0,criterioMov.lastIndexOf(' AND '));            
            campiFiltroMov.pop();        
        } else {
            orderMov = '';
            criterioMov = '';
            campiFiltroMov=[];
        }
        
        nMov=0;
        totMov=-1;
        loadMov();
        
    
    } else {
        
        if (keepPrevious) {
            criterioIsu = criterioIsu.substr(0,criterioIsu.lastIndexOf(' AND '));
            campiFiltroIsu.pop();
        
        } else {
            orderIsu='';
            criterioIsu='';
            campiFiltroIsu=[];
        }
        nIsu=0;
        totIsu=-1;
        loadIsu();    
    
    }
    
    

}

function doOrder() {

    if (!lastFieldControl) return;
    
    var field = lastFieldControl;
    
    var nomeTabella = (field.className == 'movfield' ? 'movimenti' : 'isu');
    var nomeCampo = $(field).attr('fieldname');    
    var valoreCampo = field.value;
    var tipoCampo = $(field).attr('fieldtype');
    
    var aux = 'ORDER BY `' + nomeTabella + '`.`' + nomeCampo + '`' ;
    
    var currentOrder;
    if (field.className == 'movfield') {
        currentOrder = orderMov;
    } else {
        currentOrder = orderIsu;
    }
    
    if (aux == currentOrder) {
        currentOrder = aux + ' DESC';
    } else {
        currentOrder = aux;
    }

    if (field.className == 'movfield') {
        orderMov = currentOrder;
        nMov=0;
        loadMov();
                
    } else {
        orderIsu = currentOrder;
        nIsu=0;
        loadIsu();
        
    }
    

}

function formatEuro(num, postfix) {
    num = num.toString().replace(/\$|\,/g,'');
    if (isNaN(num)) num = "0";
    var sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    var cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10) cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
        num = num.substring(0,num.length-(4*i+3))+'.'+
    num.substring(num.length-(4*i+3));
    if (postfix) {
        return (((sign)?'':'-') + num + ',' + cents + postfix);
    } else {
        return (((sign)?'':'-') + num + ',' + cents + '&nbsp;&euro;');
    }
    
}

function getDataOperazione() {
    
    var aux = $('#txt_data_operazione').val();    
    return(aux.substr(6,4) + '-' + aux.substr(3,2) + '-' + aux.substr(0,2));
    
}

function createFormDown() {

    addField({label: "<<", name: 'first_isu', type: 'button', left: 10, top: 173, width: 30, height: 24, mouseup: function(){
        nIsu=0;        
        loadIsu();
    }});

    addField({label: "<", name: 'prev_isu', type: 'button', width: 30, height: 24, mouseup: function(){
        nIsu-=5;
        if (nIsu<0) nIsu=0;
        loadIsu();
    }});
    
    addField({label: ">", name: 'next_isu', type: 'button', width: 30, height: 24, mouseup: function(){
        nIsu+=5;
        if (nIsu>=totIsu) nIsu=totIsu-1;
        loadIsu();
    }});
    
    addField({label: '*', name: 'nuovo_isu', type: 'button', width: 30, height: 24, mouseup: function(){
        
        if (!confirm("Inserire un nuovo record ISU?")) {
            return;
        }
        
        sql = "INSERT INTO isu (INTESTAZIONE, `SOCIETA`) VALUES ('Nuovo record','5010')";
        execute(sql,function(data){
            if (criterioIsu=='') {
                criterioIsu = '(CONTATORE=' + data.responseText + ')';
                totIsu = 1;
                nIsu = 0;
                
            } else {
                criterioIsu = '((' + criterioIsu + ') OR (CONTATORE=' + data.responseText + '))';
                if (totIsu != -1) {
                    totIsu = parseInt(totIsu) + 1;
                    nIsu = totIsu - 1;
                }
                
            }
            
            loadIsu();
        });
        
    }});
    
    
    /*
    addField({label: ">>", name: 'last_isu', type: 'button', width: 30, click: function(){        
        nIsu=totIsu-1;
        loadIsu();
    }});
    */
    
    addField({value: '? / ?', fontSize: 14 ,name: 'isuCount', bgcolor: 'transparent', type: 'label', width: 220, height: 24});

    /*    
    SQL = "UPDATE isu SET MOVIMENTO= " & AuxMov & ", DATAALDO=#" & Format(AuxData, "mm/dd/yyyy") & "# WHERE " & AuxFiltro
    CurrentDb.Execute SQL
    
    Me.Requery
    
    SQL = "UPDATE movimenti SET associato=true WHERE movimento = " & AuxMov
    CurrentDb.Execute SQL
    
    On Error Resume Next
    Form_associa1aN.ShowFlags
    On Error GoTo 0
    */

    addField({label: "SommaFilt ?", name: 'somma_fil', type: 'button', width: 90, height: 24, mouseup: function(){        
        $('#cmd_somma_fil').html("Attendere...");
        
        query("Select SUM(acconto) as somma FROM isu " + (criterioIsu!=''?'WHERE '+criterioIsu:''), function(data){
            var somma = parseFloat(data['somma']);
            $('#cmd_somma_fil').html("Somma Filt ?");
            alert("Somma filtrati : " + formatEuro(somma,' Euro'));
        });
        
    }});
    
    addField({label: "Ass.Filtr.", name: 'associa_filtrati', type: 'button', width: 80, height: 24, mouseup: function(){
        
        if (criterioIsu=='') {
            alert("Questa funzionalita' e' attiva solo in presenza di un filtro");
            return;
        }
        
        if (idMov<=0) {
            return;
        }
        
        if (!confirm("Associare i record isu filtrati con il movimento " + idMov + " ?")) {
            return;
        }
        
        var sql;
        
        sql = "UPDATE isu SET MOVIMENTO= " + idMov + ", DATAALDO='" + getDataOperazione() + "' WHERE " + criterioIsu;
        //alert(sql);
        
        execute(sql,function (){                            
            // numero di record da segnare nella tabella isu
            var nToChange = $('input[id*="txt_bp"][value!=""]').length;
            
            for (var i=0;i<nToChange;i++) {
                $('#txt_dataaldo_'+i).val($('#txt_data_operazione').val());
                $('#txt_movimento_'+i).val(idMov);
            }
        });
        
        $('#chk_associato').css({backgroundColor: 'red' });
        sql = "UPDATE movimenti SET associato=-1 WHERE movimento = " + idMov;
        execute(sql,function (){
            $('#chk_associato').css({backgroundColor: '#F1F298'});
            $('#chk_associato').attr('checked','checked');
        });           
        
    }});
    
    
    
    
    addField({label: "Somma Ass ?", name: 'somma_ass', type: 'button', width: 100, height: 24, mouseup: function(){        
        $('#cmd_somma_ass').html("Attendere...");
        query("Select SUM(acconto) as somma FROM isu WHERE movimento = " + idMov, function(data){
            var somma = parseFloat(data['somma']);            
            $('#cmd_somma_ass').html('Somma Ass ?');
            alert("Somma associati : " + formatEuro(somma,' Euro'));
        });
    }});
    
    
    addField({label: "Filtro", name: 'filtro_isu', type: 'button', width: 60, height: 24, mouseup: function(event){        
        doFilter(event.shiftKey);
    }});

    addField({label: "Cerca", name: 'cerca_isu', type: 'button', width: 60, height: 24, mouseup: function(event){ 
        doSearch();
    }});

    
    addField({label: "Ordina", name: 'ordina_isu', type: 'button', width: 60, height: 24, mouseup: function(){
        doOrder();        
    }});
    
    addField({label: "Togli Filtro", name: 'azzera_isu', type: 'button', width: 90, height: 24, mouseup: function(event){
        removeFilter('isu',event.shiftKey);
    }});

    
    
    createISUform(0,210);
    createISUform(1,318);
    createISUform(2,426);
    createISUform(3,534);
    createISUform(4,642);
    
    $('.isufield,.movfield').blur(function(event){
        lastFieldControl = this;
    });
    
}

function setFlag() {
    
    var idctl = this.id;
    var nome = this.name.replace(/_/g,' ');
    var stato = !!this.checked;
    
    sql = "UPDATE movimenti SET `" + nome + "` = " + (stato?'-1':'0') + " WHERE movimento=" + idMov;
    $(this).css({backgroundColor: 'red' });
    
    execute(sql, function (){
        $('#' + idctl).css({backgroundColor: '#F1F298' });
        totMov = -1;
    });
    
    postAssocia();
    
}


function postAssocia() {
    
    // ricarico il numero dei movimenti cosi' si aggiorna
    totMov=-1;
    // salvo la posizione corrente
    savePos = nMov;    
    //marco il prossimo spostamento come dopo una associazione
    ricaricaMov=true;
    
}

function createFormUp() {
    
    var rowHeight = 35;
    
    addField({name: 'containerMov', type: 'box', border: '1px solid black', left: 0, top: 30, width: 1010, height: 141, bgcolor: '#CCFFFF'});
    addField({name: 'containerSep', type: 'box', left: 0, top: 173, width: 1010, height: 24, bgcolor: '#FFFF00'});
    
    addField({classe: 'movfield', name: 'azienda', value: '', left: 10, top: 42, width: 115});
    addField({classe: 'movfield', name: 'abi', fieldtype: 'num', value: '', width: 45});
    addField({classe: 'movfield', name: 'descrizione_abi', fieldname: 'Descrizione Abi', value: '', width: 290});    
    addField({classe: 'movfield', label: 'Data Op.', name: 'data_operazione', fieldname: 'Data operazione', fieldtype: 'date', value: '', width: 85});
    addField({classe: 'movfield', name: 'data_valuta', fieldname: 'Data Valuta', fieldtype: 'date', value: '', width: 85});
    addField({classe: 'movfield', name: 'importo', fieldtype: 'num', value: '', width: 120});
    addField({classe: 'movfield', name: 'movimento', fieldtype: 'num', value: '', width: 80});
    addField({classe: 'movfield', name: 'pri', value: '', width: 20});
    addField({type: 'return'});
    
    addField({classe: 'movfield', name: 'banca', value: '', left: 10, width: 115});
    addField({classe: 'movfield', label: 'C/C', name: 'nro_cc', fieldname: 'Nro cc', value: '', width: 115});
    //addField({type: 'filler', width: 115});
    
    addField({label: "Filtra ISU", name: 'filtra_isu', type: 'button', width: 115, mouseup: function(){
        filtraISU();        
    }})
    
    
    
    addField({classe: 'movfield', name: 'note', type: 'area', fontSize: 12, value: '', width: 535, height: 92});
    addField({type: 'return'});
    
    addField({classe: 'movfield', name: 'hbp', value: '', left: 10, width: 115});
    addField({classe: 'movfield', name: 'hcontocontr', value: '', width: 115});
    addField({classe: 'movfield', name: 'hncontr', value: '', width: 115});
    addField({type: 'return'});
    
    addField({classe: 'movfield', name: 'note2', value: '', left: 10, width: 365, keyup: function(event) {
        if (event.keyCode == '13') {
            event.preventDefault();
            sql = "UPDATE movimenti SET note2='" + this.value.replace(/\'/g,"\\'") + "' WHERE movimento=" + idMov;            
            $(this).css({backgroundColor: 'red' });
            execute(sql,function (){                
                $('#txt_note2').css({backgroundColor: '#F1F298' });
                totMov = -1;
            });
            postAssocia();            
        }
        
    }});
    
    addField({type: 'return'});
    
    addField({label: 'ASSOC.', name: 'associato', type: 'check', value: '', left: 930, top: 50, click: setFlag });
    addField({label: 'CORR.', name: 'correntisti', type: 'check', value: '', left: 930, top: 75, click: setFlag });
    addField({label: 'SPOR.', name: 'sportello', type: 'check', value: '', left: 930, top: 100, click: setFlag });
    addField({label: 'ALTRO', name: 'altro', type: 'check', value: '', left: 930, top: 125, click: setFlag });
    addField({label: 'NON TR.',name: 'non_trovato',  fieldname: 'Non trovato', type: 'check', value: '', left: 930, top: 150, click: setFlag });

    

    var toolbarLeft = 110;
    var toolbarTop = 0;
    var toolbarWidth =  30;
    var toolbarHeight =  20;
    var toolbarSep =  5;
    
    addField({label: "<<", name: 'first_mov', type: 'button', left: toolbarLeft, top: toolbarTop, width: toolbarWidth, mouseup: function(){
        nMov=0;        
        loadMov();
    }})

    addField({label: "<", name: 'prev_mov', type: 'button', width: toolbarWidth, mouseup: function(){
        nMov-=1;
        if (nMov<0) nMov=0;
        loadMov();
    }})
    
    addField({label: ">", name: 'next_mov', type: 'button', width: toolbarWidth, mouseup: function(){
        nMov+=1;
        if (totMov!=-1) {
            if (nMov>=totMov) nMov=totMov-1;
        } 
        loadMov();
        
    }})    

    addField({label: ">>", name: 'last_mov', type: 'button', width: toolbarWidth, mouseup: function(){        
        nMov=totMov-1;
        loadMov();
        
    }})
    
    addField({value: '? / ?', fontSize: 16 ,name: 'movCount', type: 'label', width: 220});

    addField({label: "Togli Filtro", name: 'azzera_mov', type: 'button', width: 120, mouseup: function(event){
        removeFilter('mov', event.shiftKey);
    }});

    
    addField({label: 'Non Flag.', name: 'nonFlag', type: 'check', top: 11, click: function(){
        nonFlag = 1-nonFlag;
        nMov = 0;
        totMov = -1;
        loadMov();
    }});
    
    
    $('#chk_nonFlag').attr('checked','checked');
    
    
}

$(document).ready(function() {
        
    //
    // INIT
    //
    $.ajaxSetup({
        cache:false
    });
    
    createFormUp();
    createFormDown();
    
    //
    // Giallino al focus
    //
    $('input,textarea').focus(function() {
        $(this).css({backgroundColor: '#F1F298' });
    }).blur(function() {
        $(this).css({backgroundColor: 'white' });
    });
    
    //
    // dopo aver preso il criterio, carico il MOVIMENTO
    //        
    query("SELECT archivi.id, archivi.criterio FROM opzioni JOIN archivi ON opzioni.valore = archivi.id WHERE opzioni.nome='archivio' AND opzioni.idu=" + userid ,function(data){
    
        if (data[0]['id']) {
            archivio = data[0]['id'];
        } else {
            archivio = 'Z';
        }
        
        if (data[0]['criterio']) {
            criterio = 'WHERE ' + data[0]['criterio'];
        } else {
            criterio = 'WHERE 1';
        }
        
        nMov = 0;
        totMov = -1;
        loadMov();
    });
    
    
    //
    // carico ISU
    //    
    nIsu = 0;
    totIsu = -1;
    criterioIsu='';
    loadIsu();
    
});

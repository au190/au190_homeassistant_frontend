import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-listbox/paper-listbox";
import {
  LitElement,
  html,
  TemplateResult,
  CSSResult,
  css,
  property,
  PropertyValues,
} from "lit-element";

import "../../../components/ha-switch";
import { HomeAssistant } from "../../../types";
import { HassEntity } from "home-assistant-js-websocket";

class MoreInfoSwitch extends LitElement {
  @property() public hass!: HomeAssistant;
  @property() public stateObj?: HassEntity;

  
  constructor(){
    super();
    this._wdn = ["M","T","W","T","F","S","S"];
  }

  protected render(): TemplateResult | void {
    if (!this.stateObj) {
      return html``;
    }
  
    var dlg = html`<ha-attributes .stateObj=${this.stateObj}></ha-attributes>`;
    
    if(this.stateObj.attributes.au190){

      if(this.stateObj.attributes.au190.type == 2){
        
        //console.log(this.stateObj.attributes.au190)
        var tab_1 = this.stateObj.attributes.au190.enable_irrig_sys ? '' : 'hide'
        var tab_2 = this.stateObj.attributes.au190.enable_scheduler ? '' : 'hide'
        var tab_3 = this.stateObj.attributes.au190.enable_md ? '' : 'hide'
        var tab_4 = this.stateObj.attributes.au190.enable_protection ? '' : 'hide'
      
        dlg = html`
          <div class="new">
            <div class="sep"></div>
          </div>
          <div class="new">
            <div class="h1">Irrigation system</div>
            <p></p>
            <div><paper-icon-button .icon=${"mdi:power"} class="${this.stateObj.attributes.au190.enable_irrig_sys ? 'false' : 'r'}" @click=${() => this._btnCfgi('enable_irrig_sys', 0, 0)}></paper-icon-button></div>
          </div>
          <div class="${tab_1}">
            ${(this.stateObj.attributes.au190.pulsetime === undefined) 
              ? html``
              : html`
                ${Object.keys(this.stateObj.attributes.au190.pulsetime).map(item => html`
                  <div class='new'>
                    <div class="t1">Zone${(parseInt(item) + 1)}</div>
                    <div class="t1"><input step="1" type='time' @change=${e => this._btnCfgi('pulsetime', item, e.target.value)} value='${this.conv_tas(1, this.stateObj.attributes.au190.pulsetime[item])}'></div>
                    <div><paper-icon-button class="${this.stateObj.attributes.au190.enable_zone[item]}" .icon=${"mdi:power"} @click=${e => this._btnCfgi('enable_zone', item, e.target.value)}></paper-icon-button></div>
                  </div>
                `)}
              `
            }
          </div>
          <div class="new">
            <div class="sep"></div>
          </div>
          <div class="new">
            <div class="h1">Scheduler</div>
            <p></p>
            <div><paper-icon-button .icon=${"mdi:power"} class="${this.stateObj.attributes.au190.enable_scheduler}" @click=${() => this._btnCfgi('enable_scheduler', 0, 0)}></paper-icon-button></div>
          </div>
          <div class="${tab_2}">
            ${(this.stateObj.attributes.au190.irrigdays === undefined) 
              ? html``
              : html`
                <div class="new w_s">
                ${Object.keys(this.stateObj.attributes.au190.irrigdays).map(item => html`
                  <input type="checkbox" ?checked=${(this.stateObj.attributes.au190.irrigdays[item])} id="w_${parseInt(item)}" @click=${() => this._btnCfgi('add_wd', parseInt(item), this)} /><label for="w_${parseInt(item)}">${this._wdn[parseInt(item)]}</label>
                `)}
                </div>
              `
            }
            <div id='new'>
              <div class="t1"><p>Start time</p></div>
              <div class="t1"><input step="1" type='time' value='00:01' class='duration'></div>
              <div><paper-icon-button .icon=${"mdi:plus-box"} class="false" @click=${() => this._btnCfgi('add_scheduler', 0, this)}></paper-icon-button></div>
            </div>
            ${(this.stateObj.attributes.au190.scheduler === undefined) 
              ? html``
              : html`
                ${Object.keys(this.stateObj.attributes.au190.scheduler).map(item => html`
                  <div class='new'>
                    <div class="t1">Start time${(parseInt(item) + 1)}</div>
                    <div class="t1"><input step="1" type='time' @change=${e => this._btnCfgi('scheduler', item, e.target.value)} value='${this.stateObj.attributes.au190.scheduler[item]}'></div>
                    <div><paper-icon-button class="false" .icon=${"mdi:delete"} @click=${e => this._btnCfgi('del_scheduler', item, e.target.value)}></paper-icon-button></div>
                  </div>
                `)}
              `
              }
          </div>
          <div class="new">
            <div class="sep"></div>
          </div>
          <div class="new">
            <div class="h1">Md settings</div>
            <p></p>
            <div><paper-icon-button .icon=${"mdi:power"} class="${this.stateObj.attributes.au190.enable_md}" @click=${() => this._btnCfgi('enable_md', 0, 0)}></paper-icon-button></div>
          </div>
          <div class="${tab_3}">
            <div class="ima">
              <paper-icon-button .icon=${"mdi:motion-sensor"} class="m${this.stateObj.attributes.au190.md_status[0]}"></paper-icon-button>
              <paper-icon-button .icon=${"mdi:motion-sensor"} class="m${this.stateObj.attributes.au190.md_status[1]}"></paper-icon-button>
              <paper-icon-button .icon=${"mdi:motion-sensor"} class="m${this.stateObj.attributes.au190.md_status[2]}"></paper-icon-button>
            </div>
            <div class="new">
              <div class="t1">Md on time</div>
              <div class="t1"><input step="1" type='time' class='end_time' @change=${e => this._btnCfgi('md_on_time', 0, e.target.value)} value='${this.conv_tas(1, this.stateObj.attributes.au190.md_on_time)}'></div>
              <div class="t2"></div>
            </div>
            <div class="new">
              <p>Start time</p>
              <p>End time</p>
              <p></p>
            </div>
            <div class='new' id='new_md'>
              <div class="t1"><input step="1" type='time' value='01:00' class='start_time'></div>
              <div class="t1"><input step="1" type='time' value='02:00' class='end_time'></div>
              <div><paper-icon-button .icon=${"mdi:plus-box"} class="false" @click=${() => this._btnCfgi('add_md', 0, this)}></paper-icon-button></div>
            </div>
            ${(this.stateObj.attributes.au190.md === undefined) 
              ? html``
              : html`
                ${Object.keys(this.stateObj.attributes.au190.md).map(item => html`
                  <div class='new'>
                    <div class="t1"><input step="1" type='time' @change=${e => this._btnCfgi('start_time', item, e.target.value)} value='${this.stateObj.attributes.au190.md[item].start_time}'></div>
                    <div class="t1"><input step="1" type='time' @change=${e => this._btnCfgi('end_time', item, e.target.value)} value='${this.stateObj.attributes.au190.md[item].end_time}'></div>
                    <div><paper-icon-button class="false" .icon=${"mdi:delete"} @click=${e => this._btnCfgi('del_md', item, e.target.value)}></paper-icon-button></div>
                  </div>
                `)}
              `
            }
          </div>
          <div class="new">
            <div class="sep"></div>
          </div>
          <div class="new">
            <div class="h1">Protection</div>
            <p></p>
            <div><paper-icon-button .icon=${"mdi:power"} class="${this.stateObj.attributes.au190.enable_protection}" @click=${() => this._btnCfgi('enable_protection', 0, 0)}></paper-icon-button></div>
          </div>
          <div class="${tab_4}">
            <div class="ima">
              <div><paper-icon-button .icon=${"mdi:engine-outline"} class="${this.stateObj.attributes.au190.motor}"></paper-icon-button></div>
              <div><paper-icon-button .icon=${"mdi:water-pump-off"} class="${this.stateObj.attributes.au190.waterLim}"></paper-icon-button></div>
              <div><paper-icon-button .icon=${"mdi:weather-pouring"} class="${this.stateObj.attributes.au190.rainLim}"></paper-icon-button></div>
            </div>
            <div class="new">
              <p class="t1">MotorRunTout</p>
              <div class="t1"><input step="1" type='time' @change=${e => this._btnCfgi('motorRunningTout', 0, e.target.value)} value='${this.conv_tas(4, this.stateObj.attributes.au190.motorRunningTout)}'></div>
              <div><paper-icon-button .icon=${"mdi:power"} class="${this.stateObj.attributes.au190.enable_motorRunningToL}" @click=${() => this._btnCfgi('enable_motorRunningToL', 0, 0)}></paper-icon-button></div>
            </div>
            <div class="new">
              <p class="t1">WaterLimTout</p>
              <div class="t1"><input step="1" type='time' @change=${e => this._btnCfgi('waterLimTout', 0, e.target.value)} value='${this.conv_tas(4, this.stateObj.attributes.au190.waterLimTout)}'></div>
              <div><paper-icon-button .icon=${"mdi:power"} class="${this.stateObj.attributes.au190.enable_waterL}" @click=${() => this._btnCfgi('enable_waterL', 0, 0)}></paper-icon-button></div>
            </div>
            <div class="new">
              <p class="t1">RainLimTout</p>
              <div class="t1"><input step="1" type='time' @change=${e => this._btnCfgi('rainLimTout', 0, e.target.value)} value='${this.conv_tas(4, this.stateObj.attributes.au190.rainLimTout)}'></div>
              <div><paper-icon-button .icon=${"mdi:power"} class="${this.stateObj.attributes.au190.enable_rainL}" @click=${() => this._btnCfgi('enable_rainL', 0, 0)}></paper-icon-button></div>
            </div>
          </div>
          <div class="new">
            <div class="sep"></div>
          </div>
          <div class="new">
            <div class="h1">Info</div>
            <p></p>
            <div><paper-icon-button .icon=${"mdi:refresh"} class="false" @click=${() => this._get_info("au190_mqtt_irrigation")}></paper-icon-button></div>
          </div>

          <ha-attributes
            .stateObj=${this.stateObj}
            .extraFilters=${"au190"}
          ></ha-attributes>
        `;
        
      }else{

        var tab_1 = this.stateObj.attributes.au190.enable_scheduler ? '' : 'hide'
      
        dlg = html`
          <div class="new">
            <div class="sep"></div>
          </div>
          <div class="new">
            <div class="t1 h1"><p>Count down:</p></div>
            <div class="t1"><input step="1" type="time" @change=${e => this._btnCfg('countDown', 0, e.target.value)} .value='${this.conv_tas(1, this.stateObj.attributes.au190.countDown)}'></div>
            <div><paper-icon-button .icon=${"mdi:power"} class="${this.stateObj.attributes.au190.enable_countDown}" @click=${() => this._btnCfg('enable_countDown', 0, this)}></paper-icon-button></div>
          </div>
          <div class="new">
            <div class="sep"></div>
          </div>
          <div class="new">
            <div class="h1">Scheduler</div>
            <p></p>
            <div><paper-icon-button .icon=${"mdi:power"} class="${this.stateObj.attributes.au190.enable_scheduler}" @click=${() => this._btnCfg('enable_scheduler', 0, 0)}></paper-icon-button></div>
          </div>
          <div class="${tab_1}">
            <div class="new">
              <p>Start time</p>
              <p>Duration</p>
              <p></p>
            </div>
            <div id='new'>
              <div class="t1"><input step="1" type='time' value='00:00' class='start_time'></div>
              <div class="t1"><input step="1" type='time' value='00:01' class='duration'></div>
              <div><paper-icon-button .icon=${"mdi:plus-box"} class="false" @click=${() => this._btnCfg('add_scheduler', 0, this)}></paper-icon-button></div>
            </div>
            ${(this.stateObj.attributes.au190.scheduler === undefined) 
              ? html``
              : html`
                ${Object.keys(this.stateObj.attributes.au190.scheduler).map(item => html`
                  <div class='new'>
                    <div class="t1"><input step="1" type='time' @change=${e => this._btnCfg('start_time', item, e.target.value)} value='${this.stateObj.attributes.au190.scheduler[item].start_time}'></div>
                    <div class="t1"><input step="1" type='time' @change=${e => this._btnCfg('duration', item, e.target.value)} value='${this.conv_tas(1, this.stateObj.attributes.au190.scheduler[item].duration)}'></div>
                    <div><paper-icon-button class="false" .icon=${"mdi:delete"} @click=${e => this._btnCfg('del', item, e.target.value)}></paper-icon-button></div>
                  </div>
                `)}
              `
            }
          </div>
          <div class="new">
            <div class="sep"></div>
          </div>
          <div class="new">
            <div class="h1">Info</div>
            <p></p>
            <div><paper-icon-button .icon=${"mdi:refresh"} class="false" @click=${() => this._get_info("au190_mqtt_switch")}></paper-icon-button></div>
          </div>

          <ha-attributes
            .stateObj=${this.stateObj}
            .extraFilters=${"au190"}
          ></ha-attributes>
        `;
      }
    }
    
    return html`
      ${dlg}
    `;
  }

  static get styles(): CSSResult {
    return css`

      .sep
      {
      width: 100%;
      height: 1px;
      background-image: linear-gradient(to right, transparent, var(--primary-color), transparent);
      }
    
      #new, .new, .ima
      {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      min-height: 40px;
      }
      .ima{
        justify-content: space-around;
      }
      .hide{
      display: none;
      }
      .h1{
      font-weight: bold;
      }
      .t1, .t1 input{
      width: 122px;
      }
      .t2{
      width: 40px;
      }
      .false, .m0
      {
      color: #808080;
      }
      .true, .m1
      {
      color: #03a9f4;
      }
      .r, .m2
      {
      color: #FF0000;
      }
      .g
      {
      color: #014a01;
      }
      

     .w_s input {
      display: none!important;
      }

      .w_s input[type=checkbox] + label {
        display: inline-block;
        border-radius: 6px;
        border: 1px solid var(--primary-color);
        height: 25px;
        width: 25px;
        margin-right: 3px;
        line-height: 25px;
        text-align: center;
        cursor: pointer;
      }

      .w_s input[type=checkbox]:checked + label {
        background: var(--primary-color);
        color: #ffffff
      }

    `;
  }

  _btnCfg(f, i, e){
    
    //console.log('--> _btnCfg: [' + f + '][' + i + '][' + e + ']');
    
    if(f == 'enable_countDown'){

      this.stateObj.attributes.au190.enable_countDown = !this.stateObj.attributes.au190.enable_countDown;
      
    }else if(f == 'countDown'){
      
      this.stateObj.attributes.au190.countDown = this.conv_tas(0, e);

    }else if(f == 'enable_scheduler'){
      
      this.stateObj.attributes.au190.enable_scheduler = !this.stateObj.attributes.au190.enable_scheduler;

    }else if(f == 'add_scheduler'){
      var o = {};
      let inputs = this.shadowRoot.getElementById('new').getElementsByTagName('input');
      
      for (let input of inputs) {
        if(input.className == 'duration'){
          o[input.className] = this.conv_tas(0, input.value);
        }else{
          o[input.className] = this.conv_tas(2, input.value);
        }
      }

      if(this.stateObj.attributes.au190.scheduler === undefined){
        this.stateObj.attributes.au190['scheduler'] = [];
      }
      this.stateObj.attributes.au190.scheduler.push(o);
      
    }else if(f == 'del'){

      this.stateObj.attributes.au190.scheduler.splice(i, 1)
      
    }else if(f == 'start_time'){
      
      this.stateObj.attributes.au190.scheduler[i][f] = this.conv_tas(2, e);
      
    }else if(f == 'duration'){
      
      this.stateObj.attributes.au190.scheduler[i][f] = this.conv_tas(0, e);
    
    }


    this._set_attr("au190_mqtt_switch");

  }

  _zoneSwitch(zone) {
    this.hass.callService("au190_mqtt_irrigation", "sw_zone", 
      {
      "entity_id": this.stateObj.entity_id,
      "zone": zone
      }
    );
  }
  _set_attr(entity){

    this.hass.callService(entity, "set_attr",
      {
      "entity_id": this.stateObj.entity_id,
      "au190": this.stateObj.attributes.au190,
      }
    );
  }
  _get_info(entity){

    this.hass.callService(entity, "get_info", {
      "entity_id": this.stateObj.entity_id
    });
  }

  _btnCfgi(f, i, e) {
    
    //console.log('--> _btnCfgi: [' + f + '][' + i + '][' + e + ']');
    
    if(f == 'enable_zone'){
      
      this.stateObj.attributes.au190['enable_zone'][i] = !this.stateObj.attributes.au190['enable_zone'][i];

    }else if(f == 'pulsetime'){
      
      this.stateObj.attributes.au190['pulsetime'][i] = this.conv_tas(0, e);
      
    }else if(f == 'add_wd'){
      
      this.stateObj.attributes.au190['irrigdays'][i] = !this.stateObj.attributes.au190['irrigdays'][i];
      
    }else if(f == 'enable_scheduler'){
      
      this.stateObj.attributes.au190.enable_scheduler = !this.stateObj.attributes.au190.enable_scheduler;

    }else if(f == 'add_scheduler'){

      let inputs = this.shadowRoot.getElementById('new').getElementsByTagName('input');
      for (let input of inputs) {
        if(input.className == 'duration'){
          this.stateObj.attributes.au190.scheduler.push(this.conv_tas(2, input.value));
        }
      }
      
    }else if(f == 'del_scheduler'){

      this.stateObj.attributes.au190.scheduler.splice(i,1)
      
    }else if(f == 'scheduler'){

      this.stateObj.attributes.au190.scheduler[i] = this.conv_tas(2, e);

    }else if(f == 'enable_irrig_sys'){
      
      this.stateObj.attributes.au190.enable_irrig_sys = !this.stateObj.attributes.au190.enable_irrig_sys;

    }else if(f == 'enable_md'){
      
      this.stateObj.attributes.au190.enable_md = !this.stateObj.attributes.au190.enable_md;
    
     }else if(f == 'md_on_time'){
      
      this.stateObj.attributes.au190.md_on_time = this.conv_tas(0, e);
      
    }else if(f == 'add_md'){

      var o = {};
      let inputs = this.shadowRoot.getElementById('new_md').getElementsByTagName('input');
      
      for (let input of inputs) {
        if(input.className == 'end_time'){
          o[input.className] = this.conv_tas(2, input.value);
        }else{
          o[input.className] = this.conv_tas(2, input.value);
        }
      }
      
      this.stateObj.attributes.au190.md.push(o);
      
    }else if(f == 'del_md'){

      this.stateObj.attributes.au190.md.splice(i,1);
    
    }else if(f == 'start_time'){
      
      this.stateObj.attributes.au190.md[i][f] = this.conv_tas(2, e);
      
    }else if(f == 'end_time'){
      
      this.stateObj.attributes.au190.md[i][f] = this.conv_tas(2, e);
    
    }else if(f == 'enable_protection'){
      
      this.stateObj.attributes.au190.enable_protection = !this.stateObj.attributes.au190.enable_protection;
    
    }else if(f == 'enable_rainL'){
      
      this.stateObj.attributes.au190.enable_rainL = !this.stateObj.attributes.au190.enable_rainL;

    }else if(f == 'rainLimTout'){
      
      this.stateObj.attributes.au190.rainLimTout = this.conv_tas(3, e);

    }else if(f == 'enable_waterL'){
      
      this.stateObj.attributes.au190.enable_waterL = !this.stateObj.attributes.au190.enable_waterL;
      
    }else if(f == 'waterLimTout'){
      
      this.stateObj.attributes.au190.waterLimTout = this.conv_tas(3, e);
      
    }else if(f == 'motorRunningTout'){
      
      this.stateObj.attributes.au190.motorRunningTout = this.conv_tas(3, e);
    
    }else if(f == 'enable_motorRunningToL'){
      
      this.stateObj.attributes.au190.enable_motorRunningToL = !this.stateObj.attributes.au190.enable_motorRunningToL;
    
    }
    
    this._set_attr("au190_mqtt_irrigation");

  }
  
  /*******************************************************

    Convert cDown time to Tasmota PulseTime1
    
    i = 0 - Time to Tasmota PulseTime1
    i = 1 - Tasmota PulseTime1 to Time
		i = 2 - Force seconds to 0
    i = 3 - Time to sec
    i = 4 - Sec to Time
  *******************************************************/
  conv_tas(i, d){

    var r = null;
    try{
      
      if(i==0){
        var a = d.split(':'); // split it at the colons
        if(a.length == 2){
          r = ( (+a[0]) * 60 * 60 + (+a[1]) * 60 );
        }else if(a.length == 3){
          r = ( (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]) );
        }
        if(r==0){
          
        }else if(r<12){
          r = r * 10;
        }else{
          r = r + 100;
        }
        if(r>64900){
          r = 64900;
        }
        
      }else if(i==1){
        
        if(d==0){

        }else if(d<=111){
          d = d/10;
        }else if(d>111){
          d = d - 100;
        }
      
        var sec_num = parseInt(d, 10);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        
        r = hours+':'+minutes+':'+seconds;
        
			}else if(i==2){
				var a = d.split(':'); // split it
        if(a.length == 1){
          r = "00:00";
        }else if(a.length == 3){
          r = a[0] + ":" + a[1];
        }else{
          r = d;
        }
      
      }else if(i==3){
        var a = d.split(':'); // split it at the colons
        if(a.length == 2){
          r = ( (+a[0]) * 60 * 60 + (+a[1]) * 60 );
        }else if(a.length == 3){
          r = ( (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]) );
        }
      }else if(i==4){
        
        var sec_num = parseInt(d, 10);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        
        r = hours+':'+minutes+':'+seconds;
      }
      
    }catch(e){
      console.error('conv_tas: ' + e);
    }
    //console.log('<-- conv_tas: [' + i + '][' + d + '][' + r + ']');
    return r;
  }

  
}

customElements.define("more-info-switch", MoreInfoSwitch);

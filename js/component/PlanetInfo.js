var planetNames = new Array();
planetNames.push("Dangolag");
planetNames.push("Alboolore");
planetNames.push("Serndoious");
planetNames.push("Roidious");
planetNames.push("Gamussha");
planetNames.push("Danelmir");
planetNames.push("Cororaari");
planetNames.push("Dayelion");
planetNames.push("Daypidor");
planetNames.push("Ryadra");
planetNames.push("Roustcant");
planetNames.push("Danbrilldal");
planetNames.push("Kashelbah");
planetNames.push("Alpiious");
planetNames.push("Corordal");
planetNames.push("Tundtipin");
planetNames.push("Alsipin");
planetNames.push("Algomir");
planetNames.push("Alellag");
planetNames.push("Yaayyyk");
planetNames.push("Roelmir");
planetNames.push("Tantellia");
planetNames.push("Dansilag");
planetNames.push("Kashpilia");
planetNames.push("Mandbrindor");
planetNames.push("Tundsibah");
planetNames.push("Kashustion");
planetNames.push("Besdolia");
planetNames.push("Corbrinwui");
planetNames.push("Nabrilllore");
planetNames.push("Alusaari");
planetNames.push("Tantsilia");
planetNames.push("Enelloth");
planetNames.push("Daypilag");
planetNames.push("Varlbrinloth");
planetNames.push("Yagoloth");
planetNames.push("Sullgosha");
planetNames.push("Eneldra");
planetNames.push("Serntiious");
planetNames.push("Bothisaan");
planetNames.push("Sullbrinaari");
planetNames.push("Varlustlore");
planetNames.push("Tranpidal");
planetNames.push("Roustsha");
planetNames.push("Enbrilllag");

var PlanetInfo = function(structureList, owner) {
	this.name = planetNames[Math.floor(Math.random() * (planetNames.length - 1))];
	if (this.structureList == null) {
		this.structureList = new Array();
		this.structureList.push("Factory");
	}
	else {
		this.structureList = structureList;
	}
	this.owner = owner;
}
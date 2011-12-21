var solarNames = new Array();
solarNames.push("Alpha Centauri A");
solarNames.push("Alpha Centauri B");
solarNames.push("Epsilon Eridani");
solarNames.push("Tau Ceti");
solarNames.push("Sigma Draconis");
solarNames.push("Eta Cassiopeiae A");
solarNames.push("Delta Pavonis");
solarNames.push("Xi Bootis A");
solarNames.push("Beta Hydri");
solarNames.push("Rho Eridani A");
solarNames.push("Rho Eridani B");
solarNames.push("Zeta Tucanae");
solarNames.push("Gamma Leporis A");
solarNames.push("Kappa Ceti");
solarNames.push("Gamma Pavonis");
solarNames.push("Aplha Mensae");
solarNames.push("Zeta 1 Reticuli");
solarNames.push("Zeta 2 Reticuli");
solarNames.push("Iota Horologii");
solarNames.push("Charas Prime");
solarNames.push("Epsilon Indi");

var usedSolarNames = new Array();
for (var i = 0; i < solarNames.length; i++) {
	usedSolarNames[solarNames[i]] = false;
}

var getSolarName = function() {
	var sname = solarNames[random(0, solarNames.length - 1)];
	while (usedSolarNames[sname]) {
		sname = solarNames[random(0, solarNames.length - 1)];
	}
	usedSolarNames[sname] = true;
	return sname;

}
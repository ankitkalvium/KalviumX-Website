// Apps Script for the student tracker Google Sheet.
// Paste this whole file into Extensions > Apps Script in that spreadsheet,
// replacing the default Code.gs content. Then set up the trigger — see the
// setup instructions, since onEdit alone is NOT enough (Google blocks
// network calls from simple triggers).
//
// Before running: replace SYNC_SECRET below with the real value of
// STUDENT_SHEET_SYNC_SECRET (ask whoever manages the Vercel env vars).
// Never commit the real secret here — this file is tracked in git and gets
// pasted into a shared Sheet's script editor, so treat it as semi-public.

var SYNC_URL = "https://kalvium-x-website.vercel.app/api/integrations/student-sheet-sync";
var SYNC_SECRET = "REPLACE_WITH_STUDENT_SHEET_SYNC_SECRET";

// This is the function you wire up as an installable trigger (see setup
// instructions below) — it reads every tab in the spreadsheet and pushes
// the full current state. Re-sending everything on every edit is simpler
// and far more robust than trying to diff individual cell changes (handles
// pasted blocks, row inserts/deletes, reordered columns, etc. for free).
function syncStudentsOnEdit(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var students = [];

  sheets.forEach(function (sheet) {
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return;

    var headers = data[0].map(function (h) {
      return String(h).trim().toLowerCase();
    });

    function colIndex() {
      for (var i = 0; i < arguments.length; i++) {
        var idx = headers.indexOf(arguments[i]);
        if (idx !== -1) return idx;
      }
      return -1;
    }

    var idx = {
      email: colIndex("student email", "email"),
      name: colIndex("name"),
      year: colIndex("year of study", "year"),
      squad: colIndex("squadnumber", "squad number"),
      campus: colIndex("campusname", "campus name"),
      location: colIndex("location"),
      placements: colIndex("placements status"),
      eligibility: colIndex("eligibility status"),
      workIntegration: colIndex("work integration status"),
      availability: colIndex("student availability for work", "availability for work"),
    };

    if (idx.email === -1) return; // this tab doesn't look like a student list

    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var email = String(row[idx.email] || "").trim();
      if (!email) continue;

      students.push({
        email: email,
        name: idx.name !== -1 ? String(row[idx.name] || "").trim() : "",
        yearOfStudy: idx.year !== -1 ? String(row[idx.year] || "").trim() : "",
        squadNumber: idx.squad !== -1 ? String(row[idx.squad] || "").trim() : "",
        campusName: idx.campus !== -1 ? String(row[idx.campus] || "").trim() : "",
        location: idx.location !== -1 ? String(row[idx.location] || "").trim() : "",
        placementsStatus: idx.placements !== -1 ? String(row[idx.placements] || "").trim() : "",
        eligibilityStatus: idx.eligibility !== -1 ? String(row[idx.eligibility] || "").trim() : "",
        workIntegrationStatus: idx.workIntegration !== -1 ? String(row[idx.workIntegration] || "").trim() : "",
        availabilityForWork: idx.availability !== -1 ? String(row[idx.availability] || "").trim() : "",
      });
    }
  });

  if (students.length === 0) return;

  UrlFetchApp.fetch(SYNC_URL, {
    method: "post",
    contentType: "application/json",
    headers: { "x-sync-secret": SYNC_SECRET },
    payload: JSON.stringify({ students: students }),
    muteHttpExceptions: true,
  });
}

// Run this once manually (select it in the toolbar dropdown, click Run) to
// do an initial full sync without waiting for the next edit.
function syncStudentsNow() {
  syncStudentsOnEdit(null);
}

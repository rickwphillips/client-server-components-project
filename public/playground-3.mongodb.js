/* global use, db */

use('family-relationships');

var currentMember;
var currentMemberFamilyView;
var familyMembers = [];
var familyMemberIds = [];
var familyMemberViewIds = [];

// Find user by email and set the current member.
const findUserByEmail = (email) => {
  // Search for documents in the current collection.
  var user = db.getCollection('user').find( { email } );
  var currentUser;
  var emailMember;

  // Ensure that we have exactly one user.
  while (user.hasNext()) {
    // Duplicate check.
    if (currentUser) throw new Error('More than one user found');
    var currentUser = user.next();
  }
  // Ensure that we have a user.
  if (!currentUser) throw new Error('No user found');

  // Find the member associated with the current user.
  var member = db.getCollection('member').find( { 
    userId: new ObjectId(currentUser._id.toString()) 
  } );


  while (member.hasNext()) {
    // Duplicate check.
    if (emailMember) throw new Error('More than one member found');
    var emailMember = member.next();
  }

  familyMemberIds.push(parseInt(emailMember.id));

  return emailMember;
}

// Search for family members via the relationship collection.
const searchFamilyMembers = (memberId) => {
  return db.getCollection('relationship').find( {  
    $or: [
      { seniorMemberId: memberId },
      { juniorMemberId: memberId },
    ]
  } );
}

/**
 * Update the family member data for ensure that we perform only needed searches.\
 * @param {Number} memberId
 * @param {Object} familyMember
 */
const updateFamilyMemberData = (memberId, familyMember) => {
    const noAddIds = [
      parseInt(memberId),
      parseInt(currentMember.id),
    ];

    const addMemberIds = [
      parseInt(familyMember.seniorMemberId.toString()),
      parseInt(familyMember.juniorMemberId.toString()),
    ];

    familyMembers.push(familyMember);

    addMemberIds.forEach((id) => {
      if (!noAddIds.includes(id) && !familyMemberViewIds.includes(id)) {
        familyMemberIds.push(id);
        familyMemberViewIds.push(id);
      }
    });
}

// Create a view to get the family members of the current member.
const createFamilyMemberView = () => {
  if (db.currentMemberFamily) db.currentMemberFamily.drop();

  db.createView('currentMemberFamily', 'relationship', [{
    $match: {
        $or: [
          { seniorMemberId: {$in: familyMemberViewIds }},
          { juniorMemberId: { $in: familyMemberViewIds}},
        ]
      }

  } ] );

  // Merge the relationship type and family member data.  
  currentMemberFamilyView = db.currentMemberFamily.aggregate([
    {
      $lookup: {
        from: "relationship-type",
        localField: "typeId",
        foreignField: "name",
        as: "relationshipType"  
      }
    },
    {
      $lookup: {
        from: "member",
        localField: "seniorMemberId",
        foreignField: "id",
        as: "seniorMemberData"  
      }
    },
    {
      $lookup: {
        from: "member",
        localField: "juniorMemberId",
        foreignField: "id",
        as: "juniorMemberData"  
      }
    },
    {
      $set: {
        "relationshipType": { "$first" : "$relationshipType.name" },
        "seniorMemberData": { "$first" : "$seniorMemberData" },
        "juniorMemberData": { "$first" : "$juniorMemberData" }
      }
    },
    {
      $project: {
        "typeId": 0,
      }
    }
  ]).toArray();

  /**
   * Determine if the family member is in the list
   * and not the current member.
   * 
   * @param {*} familyMemberId 
   * @returns boolean
   */
  var isInFamilyList =  (familyMemberId) => {
    return familyMemberIds.includes(familyMemberId) || familyMemberId == currentMemberId;
  };
}


// Main loop to get the family members.
currentMember = findUserByEmail('bob@ross.com');

while (familyMemberIds.length > 0) {
  const currentSearchId = familyMemberIds.pop();
  var familyMemberResults = searchFamilyMembers(currentSearchId);
  while (familyMemberResults.hasNext()) {
    updateFamilyMemberData(currentSearchId, familyMemberResults.next());
  }
}

createFamilyMemberView();

console.log(`Family Data, Found (${currentMemberFamilyView.length}) Records:`, currentMemberFamilyView);
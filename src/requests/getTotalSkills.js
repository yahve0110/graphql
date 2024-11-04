let skillsOffset = 0;
let totalSkillArr = [];
let totalSkill = {};
let skills = ["xp"];

export async function getTotalSkills(token, limit, ID) {
  try {
    const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query {
          transaction(
            limit: ${limit},
            offset: ${skillsOffset},
            where: {
              _and: [
                { userId: { _eq: ${ID} } },
                { type: { _ilike: "%skill%" } }
              ]
            }
          ) {
            type
            amount
            objectId
            object {
              name
            }
            createdAt
            path
          }
        }`,
      }),
    });

    const jsonResponse = await response.json();
    const transactions = jsonResponse.data?.transaction || [];

    if (transactions.length > 0) {
      totalSkillArr = totalSkillArr.concat(transactions);
      skillsOffset += limit;
      return getTotalSkills(token, limit, ID); // Recursive call
    } else {
      totalSkillArr.forEach((skill) => {
        if (!totalSkill.hasOwnProperty.call(skill.type)) {
          skills.push(skill.type);
          totalSkill[skill.type] = skill.amount;
        } else {
          totalSkill[skill.type] += skill.amount;
        }
      });

      let total = 0;
      for (let key in totalSkill) {
        if (totalSkill.hasOwnProperty.call(key)) {
          total += totalSkill[key];
        }
      }
      totalSkill.total = total;

      return [totalSkill, skills];
    }
  } catch (error) {
    console.error("Error fetching skills data:", error);
    return [totalSkill, skills]; 
  }
}

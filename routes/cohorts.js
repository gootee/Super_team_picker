const express = require("express");
const knex = require("../db/client");
const router = express.Router();

router.delete("/:id", (req, res) => {
  knex("cohorts")
    .where({id: req.params.id})
    .delete()
    .then((data) => {
      res.redirect("/cohorts")
    })
})

router.get("/:id/edit", (req, res) => {
  knex("cohorts")
    .select("*")
    .where({id: req.params.id })
    .then((data) => {
      res.render("cohorts/edit", {
        cohort: data[0]
      })
    })
})

router.patch("/:id", (req, res) => {
  const cohortParams = {
    logoUrl: req.body.logoUrl,
    name: req.body.name,
    members: req.body.members,
  };
  knex("cohorts")
    .where({id: req.params.id})
    .update(cohortParams)
    .returning('id')
    .then((data) => {
      res.redirect(`/cohorts/${data[0]}`);
    });
});

router.get("/", (req, res) => {
  knex("cohorts")
    .select("*")
    // data is what is being returned from the knex/sql query
    .then((data) => {
      res.render("cohorts/index", {
        cohorts: data,
      });
    });
});


router.get("/new", (req, res) => {
  res.render("./cohorts/new", {cohort: ''});
});

// cohort show page. id is dynamic url parameter
router.get("/:id", (req, res) => {

  knex("cohorts")
    .select("*")
    .where({id: req.params.id})
    .then((data) => {
      let teams = [];
      if (req.query.method) {
        quantity = req.query.quantity;
        teamMembers = data[0].members.split(', ') || []
        let index = 0;

        const getRandomTeamMember = () => {
          index = Math.floor(Math.random() * teamMembers.length);
          thisMember = teamMembers[index];
          teamMembers.splice(index, 1);
          return thisMember;
        }

        if (req.query.method === 'numberPerTeam') {
          teamIndex = 0;
          let member
          const len = teamMembers.length
          for (let n = 0; n < len; n++) {   
            member = getRandomTeamMember();
            if (teams[teamIndex]) {
              if (teams[teamIndex].length >= quantity) {
                teamIndex ++;
                teams[teamIndex] = [];
              }
            } else {
              teams[teamIndex] = [];
            }
            teams[teamIndex].push(member);
          }
        } 

        if (req.query.method === 'teamCount') {
          teamIndex = 0;
          let member
          const len = teamMembers.length
          for (let n = 1; n <= quantity; n++) {
            teams.push([])
          }
          for (let n = 0; n < len; n++) {   
            member = getRandomTeamMember();
            teams[teamIndex].push(member);
            teamIndex = (teamIndex === quantity - 1) ? 0 : teamIndex + 1
          }

        }

        //flatten teams
        for (let n = 0; n < teams.length; n++) {
          teams[n] = teams[n].join(', ')
        }      
      }

      res.render("cohorts/show", {
        cohort: data[0], //set the local variable article to the queried cohort
        quantity: req.query.quantity,
        method: req.query.method,
        teams: teams,
      })
    })
})

router.get("/", (req, res) => {
  res.render('./cohorts/welcome');
})

router.post("/", (req, res) => {
  // console.log(req.body)
  const cohortParams = {
    logoUrl: req.body.logoUrl,
    name: req.body.name,
    members: req.body.members,
  };

  // save a cohort to database
  knex("cohorts")
    .insert(cohortParams)
    .returning("*")
    .then((data) => {
      res.send(data);
    });
});

module.exports = router;
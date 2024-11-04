import { useState, useEffect } from "react"
import PropTypes from "prop-types"

const randomColour = () => {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r},${g},${b})`
}

const SkillChart = ({ totalSkill }) => {
  const [colorArr, setColorArr] = useState([])
  const [highlightedSkill, setHighlightedSkill] = useState(null)
  const circleRadius = 12.5

  useEffect(() => {
    const colorArray = []
    let totalAmount = 0

    for (let key in totalSkill) {
      if (key !== "total") {
        totalAmount += totalSkill[key]
      }
    }

    for (let key in totalSkill) {
      if (key !== "total") {
        const percent = (totalSkill[key] / totalAmount) * 100
        let color

        if (key === "skill_js") {
          color = "#FFFF00"
        } else if (key === "skill_go") {
          color = "#27cee0"
        } else {
          color = randomColour()
        }
        colorArray.push({
          skill: key,
          percent: percent,
          amount: totalSkill[key],
          color: color,
        })
      }
    }

    setColorArr(colorArray)
  }, [totalSkill])

  const renderSkills = () => {
    let startAngle = 0

    return colorArr.map((skill, index) => {
      const endAngle = startAngle + (skill.percent / 100) * 360
      const largeArcFlag = skill.percent > 50 ? 1 : 0
      const isHighlighted = skill.skill === highlightedSkill // Check if the skill is currently highlighted

      const startX = 15 + circleRadius * Math.cos((Math.PI / 180) * startAngle)
      const startY = 15 + circleRadius * Math.sin((Math.PI / 180) * startAngle)
      const endX = 15 + circleRadius * Math.cos((Math.PI / 180) * endAngle)
      const endY = 15 + circleRadius * Math.sin((Math.PI / 180) * endAngle)

      const path = `M15,15 L${startX},${startY} A${circleRadius},${circleRadius} 0 ${largeArcFlag},1 ${endX},${endY} Z`

      startAngle = endAngle

      return (
        <g key={index}>
          <path d={path} fill={isHighlighted ? "#7b1fccc9" : skill.color} />{" "}
          {/* Highlight the segment if it corresponds to the highlighted skill */}
        </g>
      )
    })
  }

  const renderSkillLabels = () => {
    return colorArr.map((skill, index) => {
      const skillName = skill.skill.replace(/^skill_/, "")
      return (
        <text
          key={index}
          x={3}
          y={(index + 1) * 5}
          fontSize="3"
          fill={skill.skill === highlightedSkill ? "red" : "black"}
          onMouseEnter={() => setHighlightedSkill(skill.skill)}
          onMouseLeave={() => setHighlightedSkill(null)}
        >
          {`${skillName}:  ${skill.percent.toFixed(1)}% `}
        </text>
      )
    })
  }

  return (
    <div className="skillsContainer">

      <div className="skills-container">
      <h2 className="skills-title">Skills</h2>

        <svg viewBox="0 0 30 30">{renderSkills()}</svg>
      </div>
      <div className="skillsText">{renderSkillLabels()}</div>
    </div>
  )
}

SkillChart.propTypes = {
  totalSkill: PropTypes.object.isRequired,
}

export default SkillChart

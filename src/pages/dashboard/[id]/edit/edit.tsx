import styles from "./edit.module.css"
import Input from "@/components/common/input"

export default function EditPage {
    return (
<div className={styles.modal}>
        <div className={`${styles.dashboard_title_margin} text-2xl-bold`}>
          새로운 대시보드
        </div>
        <div className={`${styles.dashboard_name_margin} text-2lg-medium`}>
          대시보드 이름
        </div>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="대시보드 이름을 입력해주세요."
          disabled={false}
          padding="2.5rem 1.5rem" /*padding 사이즈를 시안에 있는 걸 넣으면 시안 이미지처럼 안나오는데..? */
          className={styles.input}
        />
        <div className={styles.color_badge_container}>
          {COLORS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedColor(item)}
              className={`${styles.color_badge} ${
                selectedColor?.id === item.id ? styles.selected : ''
              }`}
              style={{ backgroundColor: item.color }}
            >
              {' '}
              {selectedColor?.id === item.id && (
                <span className={styles.check}>✓</span>
              )}
            </button>
          ))}
        </div>
        <CommonButton
                    onClick={handleCreateDashboard}
                    variant="primary"
                    padding="1.4rem 11.4rem"
                    isActive={isCreatable}
                  >
                    생성
                  </CommonButton>
                  </div>
      </div>
    )
}


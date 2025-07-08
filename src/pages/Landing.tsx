<button
  onClick={(e) => {
    createRipple(e)
    handleNavigate('Navigating to Sign Up…', '/auth/signup')
  }}
  type="button"
  aria-label="Sign Up"
  className="
    relative overflow-hidden
    px-4 py-2 rounded-lg text-sm
    backdrop-blur-md bg-green-200/30 dark:bg-green-900/30
    border border-green-300/40 dark:border-green-700/50
    shadow transition-all duration-200 ease-out
    text-black dark:text-white
    hover:brightness-110 hover:border-opacity-70 hover:shadow-md
    active:scale-95
    group
  "
>
  <span className="relative z-10">Sign Up</span>
</button>
GLOBAL = "local"


def print_global():
    print(GLOBAL)


def set_global():
    global GLOBAL
    GLOBAL = "global"


if __name__ == "__main__":
    print_global()
    set_global()
    print_global()

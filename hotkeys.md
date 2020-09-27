# Hotkeys

# Tmux / Screen
default mod is ctrl-b for Tmux and ctrl-a for Screen. But I might have flipped.

| desc                  | hotkey tmux        | screen   | command tmux        | screen                |
| --------------------- | -------------------|--------- | --------------------|---------------------- |
| list session          |                    |          | tmux ls             | screen -ls            |
| new session           |                    |          | tmux new -s name    | screen -S name        |
| attach session        |                    |          | tmux attach -t name | screen -r name        |
| attach shared session |                    |          |                     | screen -x name        |
| detach session        | mod d              | mod d    |                     |                       |
|                       |                    |          |                     |                       |
| split horizontally    | mod %              | mod S    |                     |                       |
| split vertically      | mod "              | mod |    |                     |                       |
| pane change focus     | mod arrow keys     | mod tab  |                     |                       |
| resize pane           | mod ctrl-arrow key |          |                     |                       |
|                       |                    |          |                     |                       |
| new window            | mod c              | mod c    |                     |                       |
| rename window         | mod ,              | mod a    |                     |                       |
| switch window         | mod #num           | mod #num |                     |                       |
| next window           | mod n              |          |                     |                       |
| previous window       | mod p              |          |                     |                       |
| list windows          | mod w              |          |                     |                       |
| kill window           | mod &              |          |                     |                       |

# atles vim
## File operations

| desc                 | hotkey   | command  |
| -------------------- | -------- | -------- |
| Nerdtree Toggle      | \<C-n\>  |          |
| Nerdtree Refresh     | \<r\>    |          |
| Ag silver search     |          | :Ag      |
| Fzf Git Files        | \<C-t\>  | :GFiles  |

## Window

| desc                   | hotkey           | command  |
| ---------------------- | ---------------- | -------- |
| Split vertically       | C-w s            | :split   |
| Split horizontally     | C-w v            | :vsplit  |
| move focus right       | C-w l            |          |
| move focus left        | C-w h            |          |
| move focus up          | C-w k            |          |
| move focus down        | C-w j            |          |
| increase width         | C-w >            |          |
| decrease width         | C-w <            |          |
| increase height        | C-w +            |          |
| decrease height        | C-w -            |          |
| equal height and width | C-w =            |          |

# atles dwm

| desc                               | hotkey          |
| ---------------------------------- | --------------- |
| Shift focus left                   | mod+j           |
| Shift focus right                  | mod+k           |
| Resize to the left                 | mod+h           |
| Resize to the right                | mod+l           |
| Tiled mode (default)               | mod+t           |
| Floating mode                      | mod+f           |
| Monocle mode                       | mod+m           |
| Quit window/application            | shift+mod+q     |
| Toggle tag visibility              | mod+[1-9]       |
| Move window to tag                 | shift+mod+[1-9] |
| Move window down stack             | mod+d           |
| Move window up stack               | mod+i           |
| Toggle floating on active window   | shift+mod+space |
| Toggle bar                         | mod+b           |
| Zoom active window to master stack | mod+return      |
| Toggle view                        | mod+tab         |
